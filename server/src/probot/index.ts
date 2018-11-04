import { Application, Context } from 'probot'
import { getRepositoryConfiguration, GithubRepository } from '../github'
import { EmmaConfig } from 'emma-json-schema'

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

// Events

async function handleInstallEvent(context: Context) {
  const repositories = context.payload.repositories as GithubRepository[]

  const repositoryConfigurations = await Promise.all(
    repositories.map(repository =>
      getRepositoryConfiguration(context, repository),
    ),
  )

  const { prs, configurations } = repositoryConfigurations.reduce<{
    prs: GithubRepository[]
    configurations: (GithubRepository & EmmaConfig)[]
  }>(
    (acc, repositoryConfiguration) => {
      if (repositoryConfiguration === null) {
        return acc
        // return {
        //   ...acc,
        //   prs: [...acc.prs, repositoryConfiguration],
        // }
      } else {
        return acc
        // return {
        //   ...acc,
        //   configurations: [...acc.configurations, repositoryConfiguration],
        // }
      }
    },
    { prs: [], configurations: [] },
  )

  // check every repository: if emma-config, use that, otherwise make PR
}

async function handleRepositoryPushEvent(context: Context) {
  const configuration = await getRepositoryConfiguration(
    context,
    context.repo(),
  )

  if (changedConfiguration(context.repo(), configuration))
}

async function handleRepositoryInstallEvent(context: Context) {
  const repositories = context.payload.repositories_added
}

async function handleRepositoryUninstallEvent(context: Context) {
  const repositories = context.payload.repositories_removed
}

async function handleUninstallEvent(context: Context) {}

// Templates

const PRTemplate = `

`
