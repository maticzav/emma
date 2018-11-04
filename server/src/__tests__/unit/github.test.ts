import { Application } from 'probot'
import { GithubRepository, parsePath } from '../../github'

describe('Github functions work accordingly', () => {
  const emma = require('../../probot')

  // Config
  let app = new Application()
  app.load(emma)

  const github = {
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
  test('parsePath parses paths correctly', async () => {
    const repo: GithubRepository = {
      id: 'id',
      node_id: 'node_id',
      name: 'emma',
      owner: 'maticzav',
      full_name: 'maticzav/emma',
      ref: 'master',
      private: false,
    }

    const paths = [
      './',
      '.',
      './folder',
      './nested/folder',
      './folders/*',
      './nested/folders/*',
      './*/test',
      './*/test/*',
      './*/*/test/',
    ]

    const git = await app.auth()

    const parsedPaths = await Promise.all(
      paths.map(path => parsePath(git, repo, path)),
    )

    expect(parsedPaths).toEqual([])
  })
})
