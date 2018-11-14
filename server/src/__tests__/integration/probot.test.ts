import { Application } from 'probot'

import emma from '../../probot'

import * as installation from '../fixtures/integration/installation'

describe('Emma bot works as anticipated', () => {
  let app: Application, github: any

  describe('Application installation works', () => {
    beforeEach(() => {
      app = new Application()
      app.load(emma)

      github = null
    })

    test('Creates a PR with information about published boilerplates in repositories', async () => {})

    test('Creates a PR in unconfigured repositories', async () => {
      // github = {
      //   repos: {
      //     getContent: jest.fn().mockReturnValue(
      //       Promise.resolve({
      //         type: 'type',
      //         encoding: 'encoding',
      //         size: 'size',
      //         name: 'name',
      //         path: 'path',
      //         content: 'content',
      //         sha: 'sha',
      //         url: 'url',
      //         git_url: 'git_url',
      //         html_url: 'html_url',
      //         download_url: 'download_url',
      //         _links: {
      //           git: 'git',
      //           self: 'self',
      //           html: 'html',
      //         },
      //       }),
      //     ),
      //   },
      //   issues: {
      //     createComment: jest.fn().mockReturnValue(Promise.resolve({})),
      //   },
      // }
      // app.auth = () => Promise.resolve(github)
      // await app.receive({
      //   name: 'installation.created',
      //   payload: installation.created,
      // })
    })

    test('Files an issue in wrongly configured repository', async () => {})
  })

  describe('Application uninstallation works', () => {
    test('Removes every boilerplate and repository in installation', async () => {})
  })

  describe('Repository installation works', async () => {
    test('Creates a PR with information about configured repositories', async () => {})
    test('Creates a PR in unconfigured repositories', async () => {})
    test('Files an issue in misconfigured repositories', async () => {})
  })

  describe('Repository uninstallation works', async () => {
    test('Removes every boilerplate in uninstalled repositories', async () => {})
  })

  describe('Repository watching works - PUSH events', () => {
    test('Files an issue in misconfigured repository', async () => {})
    test('Adds a boilerplate if added in configuration', async () => {})
    test('Removes a boilerplate if removed from configuration', async () => {})
    test('Adds a boilerplate if files match glob', async () => {})
    test('Removes a boilerplate if files do not match glob anymore', async () => {})
    test('Ignores everything if no changes were made', async () => {})
  })
})
