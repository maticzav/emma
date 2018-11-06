import { Application, Context } from 'probot'
import { GithubRepository } from '../github'
import {
  installRepository,
  removeBoilerplate,
  removeInstallation,
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

  const actions = repositories.map(repository =>
    installRepository(context.github, repository, context.payload.installation),
  )

  await Promise.all(actions)
}

async function handleRepositoryPushEvent(context: Context) {
  await installRepository(
    context.github,
    context.repo(),
    context.payload.installation,
  )
}

async function handleRepositoryInstallEvent(context: Context) {
  await installRepository(
    context.github,
    context.repo(),
    context.payload.installation,
  )
}

async function handleRepositoryUninstallEvent(context: Context) {
  const repositories = context.payload.repositories
  await removeBoilerplate('')
}

async function handleUninstallEvent(context: Context) {
  await removeInstallation('')
}
