import { GitHubAPI } from 'probot/lib/github'
import { EmmaConfig } from 'emma-json-schema'

import {
  GithubRepository,
  GithubPartialRepository,
  GithubInstallation,
  PackageDefinition,
  getRepositoryConfiguration,
  createProjectSetupBranch,
  createSetupPullRequest,
  getBoilerplatePathsFromConfiguration,
  getBoilerplateDefinitionForPath,
  hydratePartialRepository,
} from './github'

/**
 *
 * Installation
 *
 */

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
): Promise<void> {
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
): Promise<void> {
  const configuration = await getRepositoryConfiguration(github, repository)
  const evaluation = await evaluateConfiguration(configuration)

  switch (evaluation.status) {
    case 'valid-configuration': {
      break
    }
    case 'missing-configuration': {
      await createProjectSetupBranch(github, repository, [])
      await createSetupPullRequest(github, repository, '')

      break
    }
    case 'invalid-configuration': {
      break
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
): Promise<void> {
  const definition = await getBoilerplateDefinitionForPath(
    github,
    repository,
    path,
    installation,
  )

  const evaluation = await evaluateDefinition(definition)

  switch (evaluation.status) {
    case 'valid-definition': {
      return
    }
    case 'invalid-definition': {
      return
    }
    case 'ignore': {
      return
    }
  }

  // return {
  //   name: definition.name,
  //   description: definition.description,
  //   path: path,
  //   repository: {
  //     owner: repository.owner,
  //     name: repository.name,
  //     branch: repository.ref,
  //   },
  //   installation: {
  //     id: installation.id,
  //   },
  // }

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
        message: 'Boilerplate is missing its deifnition file.',
      }
    }

    if (definition.private === true) {
      return { status: 'ignore' }
    }

    const availableName = await checkNameAvailability(definition.name)

    if (!availableName) {
      return {
        status: 'invalid-definition',
        message: `Name ${definition.name} is already taken.`,
      }
    }

    return {
      status: 'valid-definition',
      name: definition.name,
      description: definition.description,
    }
  }

  async function checkNameAvailability(name: string): Promise<boolean> {
    return true
  }
}

/**
 *
 * Analysis
 *
 */

/**
 *
 * Predicts the effects the current configuration will have.
 *
 * @param github
 * @param repository
 */
export async function analyseConfiguration(
  github: GitHubAPI,
  repository: GithubRepository,
): Promise<string> {
  return ''
}

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
): Promise<void> {
  return removeRepository(hydratePartialRepository(partialRepository))
}

/**
 *
 * Removes specific repository and all its boilerplates from the database.
 *
 * @param repository
 */
export async function removeRepository(
  repository: GithubRepository,
): Promise<void> {}

/**
 *
 * Removes all boilerplates in installation from the database.
 *
 * @param installation
 */
export async function removeInstallation(
  installation: GithubInstallation,
): Promise<void> {}

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
