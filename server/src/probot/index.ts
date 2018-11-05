import { Application, Context } from 'probot'
import { GithubRepository, getRepositoryConfigurations } from '../github'

// Probot

export = (app: Application) => {
  /**
   *
   * Triggered whenever Emma is installed.
   *
   */
  app.on('installation.created', handleInstallEvent)

  /**
   *
   * Triggered when repositories are added.
   *
   */
  app.on('installation_repositories.added', handleRepositoryInstallEvent)

  /**
   *
   * Triggered when repositories are removed.
   *
   */
  app.on('installation_repositories.removed', handleRepositoryUninstallEvent)

  /**
   *
   * Watches for changes in the repository. If configuration changes,
   * we should update boilerplates in the database.
   *
   */
  app.on('push', handleRepositoryPushEvent)

  /**
   *
   * Triggered whenever Emma is uninstalled by a user.
   *
   */
  app.on('installation.deleted', handleUninstallEvent)
}

/**
 *
 * Event handlers.
 *
 */

async function handleInstallEvent(context: Context) {
  const repositories = context.payload.repositories as GithubRepository[]

  const repositoriesInformation = await Promise.all(
    repositories.map(async repository => {
      const configuration = await getRepositoryConfigurations(
        context.github,
        repository,
      )

      return {
        repository,
        configuration,
      }
    }),
  )

  const actions = repositoriesInformation.map(async repositoryInformation => {
    switch (repositoryInformation.configuration) {
      case null: {
        return createSetupPullRequest(
          context.github,
          repositoryInformation.repository,
        )
      }

      default: {
        return
      }
    }
  })

  await Promise.all(actions)
}

async function handleRepositoryPushEvent(context: Context) {
  // const configuration = await getRepositoryConfiguration(
  //   context.github,
  //   context.repo(),
  // )
  // // if (configurationChanged(context.repo(), configuration)) {
  // // }
}

async function handleRepositoryInstallEvent(context: Context) {
  // const repositories = context.payload.repositories_added
}

async function handleRepositoryUninstallEvent(context: Context) {
  // const repositories = context.payload.repositories_removed
}

async function handleUninstallEvent(context: Context) {}

/**
 *
 * Workflows
 *
 */
