import { Application } from 'probot'

// Webhooks

export = (app: Application) => {
  app.on('push', async context => {})
  app.on('installation_repositories', async context => {})
}

// Helper functions
