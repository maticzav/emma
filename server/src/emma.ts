import { GitHubAPI } from 'probot/lib/github'
import { EmmaConfig } from 'emma-json-schema'

import {
  GithubRepository,
  GithubPartialRepository,
  GithubInstallation,
  PackageDefinition,
  getRepositoryConfiguration,
  getBoilerplatePathsFromConfiguration,
  getBoilerplateDefinitionForPath,
  hydratePartialRepository,
} from './github'

import * as config from './config'
import prisma from './prisma'

/**
 *
 * Installation
 *
 */

interface RepositoryInstallationSummary {
  messages: string[]
  errors: string[]
  /**
   * `messages` are used for PR messages,
   * `errors` are used for issue messages.
   */
}

/**
 *
 * Installs partial repository,
 *
 * @param github
 * @param repository
 * @param installation
 */
export async function installPartialRepository(
  github: GitHubAPI,
  partialRepository: GithubPartialRepository,
  installation: GithubInstallation,
): Promise<RepositoryInstallationSummary> {
  const repository = hydratePartialRepository(partialRepository)

  return installRepository(github, repository, installation)
}

/**
 *
 * Tries to install repository in Emma.
 *  - creates a PR if there's no config,
 *  - files an issue if config is invalid,
 *  - files an issue if boilerplates are invalid,
 *  - saves the boilerplate if everything's fine
 *
 * @param github
 * @param repository
 * @param installation
 */
export async function installRepository(
  github: GitHubAPI,
  repository: GithubRepository,
  installation: GithubInstallation,
): Promise<RepositoryInstallationSummary> {
  /**
   * Indexes a repository immediately for further usage.
   */
  await prisma.createRepository({
    githubId: repository.node_id,
    owner: repository.owner,
    name: repository.name,
    installation: { connect: { githubId: installation.id } },
  })

  /**
   * Configures boilerplates in repository.
   */
  const configuration = await getRepositoryConfiguration(github, repository)
  const evaluation = await evaluateConfiguration(configuration)

  switch (evaluation.status) {
    case 'valid-configuration': {
      /**
       * If configuration is vlaid we try to install separate boilerlates.
       */
      const installations = await Promise.all(
        evaluation.paths.map(path =>
          installBoilerplate(github, repository, path, installation),
        ),
      )

      return summariseBoilerplateInstallations(installations)
    }
    case 'missing-configuration': {
      /**
       * Missing boilerplate information is returned.
       */
      return {
        messages: [config.missingConfigurationMessage],
        errors: [],
      }
    }
    case 'invalid-configuration': {
      /**
       * Configuration error is returned in case configuraiton is not valid.
       */
      return {
        messages: [],
        errors: [evaluation.message],
      }
    }
  }

  /**
   *
   * Helper functions
   *
   */
  async function evaluateConfiguration(
    configuration: EmmaConfig | null,
  ): Promise<
    | { status: 'valid-configuration'; paths: string[] }
    | { status: 'missing-configuration' }
    | { status: 'invalid-configuration'; message: string }
  > {
    if (configuration === null) {
      return { status: 'missing-configuration' }
    }

    const paths = await getBoilerplatePathsFromConfiguration(
      github,
      repository,
      configuration,
    )

    if (!paths) {
      return {
        status: 'invalid-configuration',
        message: 'Your current configuration yields no boilerplates.',
      }
    }

    return {
      status: 'valid-configuration',
      paths,
    }
  }

  /**
   *
   * Summarises boilerplate installations into repository installation.
   *
   * @param installations
   */
  function summariseBoilerplateInstallations(
    installations: BoilerplateInstallationSummary[],
  ): RepositoryInstallationSummary {
    const summary = installations.reduce<RepositoryInstallationSummary>(
      (acc, installation) => {
        switch (installation.status) {
          case 'ok':
            return {
              messages: [...acc.messages, installation.message],
              errors: acc.errors,
            }
          case 'error':
            return {
              messages: acc.messages,
              errors: [...acc.errors, installation.message],
            }
        }
      },
      {
        messages: [],
        errors: [],
      },
    )

    return summary
  }
}

interface BoilerplateInstallationSummary {
  status: 'ok' | 'error'
  message: string
}

/**
 *
 * Tries to install a boilerplate.
 *  - files an issue if boilerplate configuration is invalid,
 *  - saves the boilerplate and updates algolia.
 *
 * @param github
 * @param repository
 * @param path
 * @param installation
 */
export async function installBoilerplate(
  github: GitHubAPI,
  repository: GithubRepository,
  path: string,
  installation: GithubInstallation,
): Promise<BoilerplateInstallationSummary> {
  /**
   * Fetches boilerplate definition from repository and path.
   */
  const definition = await getBoilerplateDefinitionForPath(
    github,
    repository,
    path,
    installation,
  )

  /**
   * Handles boilerplate according to definition.
   */
  const evaluation = await evaluateDefinition(definition)

  switch (evaluation.status) {
    case 'valid-definition': {
      /**
       * If configuration is valid, index it in database.
       */
      const { name, description } = evaluation

      const boilerplate = await prisma.createBoilerplate({
        name: name,
        description: description,
        path: path,
        repository: { connect: { githubId: repository.node_id } },
      })

      return {
        status: 'ok',
        message: `Installed ${boilerplate.name}.`,
      }
    }
    case 'invalid-definition': {
      /**
       * If boilerplate definition is invalid forward the error message
       * from validator to user.
       */
      return {
        status: 'error',
        message: `Error in ${repository.full_name}: ${evaluation.message}`,
      }
    }
    case 'ignore': {
      /**
       * In case boilerplate module is marked private.
       */
      return {
        status: 'ok',
        message: `Ignored ${repository.full_name}.`,
      }
    }
  }

  /**
   *
   * Helper functions
   *
   */

  async function evaluateDefinition(
    definition: PackageDefinition | null,
  ): Promise<
    | { status: 'ignore' }
    | { status: 'valid-definition'; name: string; description: string }
    | { status: 'invalid-definition'; message: string }
  > {
    if (definition === null) {
      return {
        status: 'invalid-definition',
        message: 'missing definition file',
      }
    }

    if (definition.private === true) {
      return { status: 'ignore' }
    }

    const availableName = await isNameAvailable(definition.name)

    if (!availableName) {
      return {
        status: 'invalid-definition',
        message: `name ${definition.name} already taken`,
      }
    }

    return {
      status: 'valid-definition',
      name: definition.name,
      description: definition.description,
    }
  }
}

/**
 *
 * Analysis
 *
 */

// /**
//  *
//  * Predicts the effects the current configuration will have.
//  *
//  * @param github
//  * @param repository
//  */
// export async function analyseConfiguration(
//   github: GitHubAPI,
//   repository: GithubRepository,
// ): Promise<string> {
//   return ''
// }

/**
 *
 * Guesses the boilerplate configuration from the repository.
 *
 * @param github
 * @param repository
 */
export async function guessBoilerplateConfigurationForRepository(
  github: GitHubAPI,
  repository: GithubRepository,
): Promise<EmmaConfig> {
  return {
    boilerplates: [],
  }
}

/**
 *
 * Management
 *
 */

export async function removePartialRepository(
  partialRepository: GithubPartialRepository,
): Promise<RepositoryRemovalSummary> {
  return removeRepository(hydratePartialRepository(partialRepository))
}

interface RepositoryRemovalSummary {
  status: 'ok' | 'error'
  message: string
}

/**
 *
 * Removes specific repository and all its boilerplates from the database.
 *
 * @param repository
 */
export async function removeRepository(
  repository: GithubRepository,
): Promise<RepositoryRemovalSummary> {
  try {
    const res = await prisma.deleteRepository({
      githubId: repository.node_id,
    })

    return {
      status: 'ok',
      message: `Repository ${res.name} successfully removed.`,
    }
  } catch (err) {
    return {
      status: 'error',
      message: err.message,
    }
  }
}

interface InstallationRemovalSummary {
  status: 'ok' | 'error'
  message: string
}

/**
 *
 * Removes all boilerplates in installation from the database.
 *
 * @param installation
 */
export async function removeInstallation(
  installation: GithubInstallation,
): Promise<InstallationRemovalSummary> {
  try {
    const res = await prisma.deleteInstallation({
      githubId: installation.id,
    })

    return {
      status: 'ok',
      message: `Installation ${res.githubId} successfully removed.`,
    }
  } catch (err) {
    return {
      status: 'error',
      message: err.message,
    }
  }
}

/**
 *
 * Utils
 *
 */

/**
 *
 * Parses configuration to a string.
 *
 * @param config
 */
export function parseConfiguration(config: EmmaConfig): string {
  return JSON.stringify(config)
}

/**
 *
 * Determines whether a boilerplate name is still available.
 *
 * @param name
 */
export async function isNameAvailable(name: string): Promise<boolean> {
  return !(await prisma.$exists.boilerplate({ name }))
}
