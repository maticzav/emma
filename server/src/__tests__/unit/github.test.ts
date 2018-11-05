import { Application } from 'probot'
import {
  GithubRepository,
  parsePathsFromGitGlob,
  GithubContent,
} from '../../github'

describe('Github functions work accordingly', () => {
  let app: Application

  // Config
  beforeEach(() => {
    app = new Application()
  })

  // Tests
  test('parsePathsForGitGlob parses paths correctly', async () => {
    const contents: GithubContent[] = [
      {
        type: 'file',
        encoding: 'encoding',
        size: 2,
        name: 'ignored',
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
      },
      {
        type: 'dir',
        encoding: 'encoding',
        size: 2,
        name: 'folder-1',
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
      },
      {
        type: 'dir',
        encoding: 'encoding',
        size: 2,
        name: 'folder-2',
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
      },
    ]

    const github = {
      repos: {
        getContent: jest.fn().mockReturnValue(Promise.resolve(contents)),
      },
    } as any

    app.auth = () => Promise.resolve(github)

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
      paths.map(async path => {
        const parsedPaths = await parsePathsFromGitGlob(git, repo, path)

        return { path, parsedPaths }
      }),
    ).then(res =>
      res.reduce(
        (acc, parsedPath) => ({
          ...acc,
          [parsedPath.path]: parsedPath.parsedPaths,
        }),
        {},
      ),
    )

    expect(parsedPaths).toEqual({
      './': ['.'],
      '.': ['.'],
      './folder': ['./folder'],
      './nested/folder': ['./nested/folder'],
      './folders/*': ['./folders/folder-1', './folders/folder-2'],
      './nested/folders/*': [
        './nested/folders/folder-1',
        './nested/folders/folder-2',
      ],
      './*/test': ['./folder-1/test', './folder-2/test'],
      './*/test/*': [
        './folder-1/test/folder-1',
        './folder-1/test/folder-2',
        './folder-2/test/folder-1',
        './folder-2/test/folder-2',
      ],
      './*/*/test/': [
        './folder-1/folder-1/test',
        './folder-1/folder-2/test',
        './folder-2/folder-1/test',
        './folder-2/folder-2/test',
      ],
    })
  })
})
