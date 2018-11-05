import { Application } from 'probot'
import {
  parsePathsFromGitGlob,
  getContent,
  getContents,
  getRepositoryConfigurations,
  mergeConfigurations,
} from '../../github'

import * as fixtures from '../fixtures/unit/github'

describe('Github functions work accordingly', () => {
  let app: Application

  // Config
  beforeEach(() => {
    app = new Application()
  })

  // Tests

  test('getRepositoryConfigurationFiles finds correct files', async () => {
    const github = {
      repos: {
        getContent: jest
          .fn()
          .mockReturnValue(
            Promise.resolve([
              fixtures.contentEmmaJson,
              fixtures.contentEmmarc,
              fixtures.contentEmmarcJson,
              fixtures.content,
            ]),
          ),
      },
    } as any

    app.auth = () => Promise.resolve(github)
    const git = await app.auth()

    const res = await getRepositoryConfigurations(git, fixtures.repo)
    expect(res).toEqual([
      fixtures.contentEmmaJson,
      fixtures.contentEmmarc,
      fixtures.contentEmmarcJson,
    ])
  })

  test('getRepositoryConfigurationFiles returns null when no files configuration files exist', async () => {
    const github = {
      repos: {
        getContent: jest
          .fn()
          .mockReturnValue(Promise.resolve(fixtures.contents)),
      },
    } as any

    app.auth = () => Promise.resolve(github)
    const git = await app.auth()

    const res = await getRepositoryConfigurations(git, fixtures.repo)
    expect(res).toBeNull()
  })

  test('mergeConfigurations merges valid configurations correctly', async () => {
    const config = mergeConfigurations(fixtures.configurations)

    expect(config).toEqual({
      boilerplates: ['glob', 'a/b/c', 'd/e/*'],
    })
  })

  test('mergeConfigurations skips invalid configurations', async () => {
    const config = mergeConfigurations([
      ...fixtures.configurations,
      fixtures.invalidConfiguration,
    ])

    expect(config).toEqual({
      boilerplates: ['glob', 'a/b/c', 'd/e/*'],
    })
  })

  test('getContent gets file', async () => {
    const github = {
      repos: {
        getContent: jest
          .fn()
          .mockReturnValue(Promise.resolve(fixtures.content)),
      },
    } as any

    app.auth = () => Promise.resolve(github)
    const git = await app.auth()

    const res = await getContent(git, fixtures.repo, '')
    expect(res).toEqual(fixtures.content)
  })

  test('getContent errors on folder', async () => {
    const github = {
      repos: {
        getContent: jest
          .fn()
          .mockReturnValue(Promise.resolve(fixtures.contents)),
      },
    } as any

    app.auth = () => Promise.resolve(github)

    const git = await app.auth()

    const res = getContent(git, fixtures.repo, '')
    expect(res).rejects.toThrow()
  })

  test('getContents gets contents', async () => {
    const github = {
      repos: {
        getContent: jest
          .fn()
          .mockReturnValue(Promise.resolve(fixtures.contents)),
      },
    } as any

    app.auth = () => Promise.resolve(github)
    const git = await app.auth()

    const res = await getContents(git, fixtures.repo, '')
    expect(res).toEqual(fixtures.contents)
  })

  test('getContents errors on file', async () => {
    const github = {
      repos: {
        getContent: jest
          .fn()
          .mockReturnValue(Promise.resolve(fixtures.content)),
      },
    } as any

    app.auth = () => Promise.resolve(github)
    const git = await app.auth()

    const res = getContents(git, fixtures.repo, '')
    expect(res).rejects.toThrow()
  })

  test('parsePathsForGitGlob parses paths correctly', async () => {
    const github = {
      repos: {
        getContent: jest
          .fn()
          .mockReturnValue(Promise.resolve(fixtures.contentsFolders)),
      },
    } as any

    app.auth = () => Promise.resolve(github)

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
        const parsedPaths = await parsePathsFromGitGlob(
          git,
          fixtures.repo,
          path,
        )

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
