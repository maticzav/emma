import { Application } from 'probot'

import emma from '../../probot'

import * as installation from '../fixtures/integration/installation'

describe('Emma sets up', () => {
  // Config
  let app = new Application()
  app.load(emma)

  let github = {
    repos: {
      getContent: jest.fn().mockReturnValue(
        Promise.resolve({
          type: 'type',
          encoding: 'encoding',
          size: 'size',
          name: 'name',
          path: 'path',
          content: 'content',
          sha: 'sha',
          url: 'url',
          git_url: 'git_url',
          html_url: 'html_url',
          download_url: 'download_url',
          _links: {
            git: 'git',
            self: 'self',
            html: 'html',
          },
        }),
      ),
    },
    issues: {
      createComment: jest.fn().mockReturnValue(Promise.resolve({})),
    },
  }

  app.auth = () => Promise.resolve(github)

  // Tests
  test('Sends a PR on new install to unconfigured repositories.', async () => {
    await app.receive({
      name: 'installation.created',
      payload: installation.created,
    })

    expect(2).toBe(1)
  })
})
