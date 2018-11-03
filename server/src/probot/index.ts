import { Application, Context } from 'probot'

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
  const { repositories } = context.payload

  // check every repository: if emma-config, use that, otherwise make PR
}

async function handleRepositoryPushEvent(context: Context) {
  if (changedEmmaConfiguration(context)) {
    const configuration = getEmmaConfiguration(context)
  }
}

async function handleRepositoryInstallEvent(context: Context) {
  const repositories = context.payload.repositories_added
}

async function handleRepositoryUninstallEvent(context: Context) {
  const repositories = context.payload.repositories_removed
}

async function handleUninstallEvent(context: Context) {}
