import { Application, Context } from 'probot'
import { GithubPartialRepository, GithubRepository } from '../github'
import {
  installRepository,
  removeInstallation,
  installPartialRepository,
  removePartialRepository,
} from '../emma'

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
   * Triggered whenever Emma is uninstalled by a user.
   *
   */
  app.on('installation.deleted', handleUninstallEvent)

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
}

/**
 *
 * Event handlers.
 *
 */

async function handleInstallEvent(context: Context) {
  const repositories = context.payload.repositories as GithubPartialRepository[]
  const installation = context.payload.installation

  const actions = repositories.map(repository =>
    installPartialRepository(context.github, repository, installation),
  )

  await Promise.all(actions)
}

async function handleRepositoryPushEvent(context: Context) {
  const repository: GithubRepository = context.repo()
  const installation = context.payload.installation

  await installRepository(context.github, repository, installation)
}

async function handleRepositoryInstallEvent(context: Context) {
  const installation = context.payload.installation
  const repositories = context.payload
    .repositories_added as GithubPartialRepository[]

  const actions = repositories.map(repository =>
    installPartialRepository(context.github, repository, installation),
  )

  await Promise.all(actions)
}

async function handleRepositoryUninstallEvent(context: Context) {
  const repositories = context.payload.repositories as GithubPartialRepository[]

  const actions = repositories.map(repository =>
    removePartialRepository(repository),
  )

  await Promise.all(actions)
}

async function handleUninstallEvent(context: Context) {
  const installation = context.payload.installation

  await removeInstallation(installation)
}
