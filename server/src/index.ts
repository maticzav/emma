import { Application } from 'probot'

export = (app: Application) => {
  app.on('issues.opened', async context => {})
}
