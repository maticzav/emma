import { GitHubAPI } from 'probot/lib/github'
import { EmmaConfig } from 'emma-json-schema'

import {
  GithubRepository,
  getRepositoryConfiguration,
  createProjectSetupBranch,
  createSetupPullRequest,
  getBoilerplatePathsFromConfiguration,
  getBoilerplateDefinitionForPath,
} from './github'

/**
 *
 * Installation
 *
 */

export async function installRepository(
  github: GitHubAPI,
  repository: GithubRepository,
): Promise<void> {
  const configuration = await getRepositoryConfiguration(github, repository)

  switch (configuration) {
    case null: {
      await createProjectSetupBranch(github, repository, [])
      await createSetupPullRequest(github, repository, '')

      return
    }

    default: {
      const paths = await getBoilerplatePathsFromConfiguration(
        github,
        repository,
        configuration,
      )

      const boilerplates = await Promise.all(
        paths.map(async path =>
          getBoilerplateDefinitionForPath(github, repository, path, ''),
        ),
      )

      return
    }
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

/**
 *
 * Removes specific boilerplate from the database.
 *
 * @param id
 */
export async function removeBoilerplate(id: string): Promise<void> {}

/**
 *
 * Removes all boilerplates in installation from the database.
 *
 * @param id
 */
export async function removeInstallation(id: string): Promise<void> {}

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
