import { Application } from 'probot'
import {
  parsePathsFromGitGlob,
  getContent,
  getContents,
  getRepositoryConfiguration,
  mergeConfigurations,
  createProjectSetupBranch,
  createSetupPullRequest,
  getBoilerplateDefinitionForPath,
  getBoilerplatePathsFromConfiguration,
  hydratePartialRepository,
} from '../../github'
import * as utils from '../../utils'
import * as config from '../../config'

import * as fixtures from '../fixtures/unit/github'

describe('Github functions work accordingly', () => {
  let app: Application

  // Config
  beforeEach(() => {
    app = new Application()
  })

  // Tests

  test('hydratePartialRepository hydrates partial repository correctly', async () => {
    const repo = hydratePartialRepository(fixtures.partialRepo)

    expect(repo).toEqual({
      id: 'id',
      node_id: 'node_id',
      name: 'emma',
      owner: 'maticzav',
      full_name: 'maticzav/emma',
      ref: 'master',
      private: false,
    })
  })

  test('getRepositoryConfiguration finds correct configuration', async () => {
    const github = {
      repos: {
        getContent: jest
          .fn()
          .mockResolvedValue([
            fixtures.contentEmmaJson,
            fixtures.contentEmmarc,
            fixtures.contentEmmarcJson,
            fixtures.content,
          ]),
      },
    }

    app.auth = () => Promise.resolve(github as any)
    const git = await app.auth()

    const mock = jest.spyOn(utils, 'downloadFile')
    mock.mockImplementation(() => fixtures.configuration)

    expect.assertions(4)

    const res = await getRepositoryConfiguration(git, fixtures.repo)

    expect(res).toEqual(fixtures.configuration)

    const { contentEmmaJson, contentEmmarc, contentEmmarcJson } = fixtures

    expect(mock).toHaveBeenNthCalledWith(1, contentEmmaJson.download_url)
    expect(mock).toHaveBeenNthCalledWith(2, contentEmmarc.download_url)
    expect(mock).toHaveBeenNthCalledWith(3, contentEmmarcJson.download_url)

    mock.mockRestore()
  })

  test('getRepositoryConfiguration returns null when no configuration files exist', async () => {
    const github = {
      repos: {
        getContent: jest.fn().mockResolvedValue(fixtures.contents),
      },
    }

    app.auth = () => Promise.resolve(github as any)
    const git = await app.auth()

    const res = await getRepositoryConfiguration(git, fixtures.repo)
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
        getContent: jest.fn().mockResolvedValue(fixtures.content),
      },
    }

    app.auth = () => Promise.resolve(github as any)
    const git = await app.auth()

    const res = await getContent(git, fixtures.repo, '')
    expect(res).toEqual(fixtures.content)
  })

  test('getContent errors on folder', async () => {
    const github = {
      repos: {
        getContent: jest.fn().mockResolvedValue(fixtures.contents),
      },
    }

    app.auth = () => Promise.resolve(github as any)

    const git = await app.auth()

    const res = getContent(git, fixtures.repo, '')
    expect(res).rejects.toThrow()
  })

  test('getContents gets contents', async () => {
    const github = {
      repos: {
        getContent: jest.fn().mockResolvedValue(fixtures.contents),
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
        getContent: jest.fn().mockResolvedValue(fixtures.content),
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
        getContent: jest.fn().mockResolvedValue(fixtures.contentsFolders),
      },
    } as any

    app.auth = () => Promise.resolve(github)

    const paths = [
      './',
      '.',
      'folder',
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
      folder: ['folder'],
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

  test('getBoilerplatePathsFromConfiguration finds the correct values', async () => {
    const github = {
      repos: {
        getContent: jest.fn().mockResolvedValue(fixtures.contentsFolders),
      },
    }

    app.auth = () => Promise.resolve(github as any)
    const git = await app.auth()

    const paths = await getBoilerplatePathsFromConfiguration(
      git,
      fixtures.repo,
      fixtures.configuration,
    )

    expect(paths).toEqual(['glob', 'glob/folder-1', 'glob/folder-2'])
  })

  test('createProjectSetupBranch correctly creates a new branch', async () => {
    const github = {
      gitdata: {
        getReference: jest
          .fn()
          .mockResolvedValue(fixtures.response(fixtures.reference)),

        createBlob: jest
          .fn()
          .mockResolvedValue(fixtures.response(fixtures.createBlobResponse)),

        createTree: jest
          .fn()
          .mockResolvedValue(fixtures.response(fixtures.createTreeResponse)),

        updateReference: jest
          .fn()
          .mockResolvedValue(
            fixtures.response(fixtures.updateReferenceResponse),
          ),
      },
    }

    app.auth = () => Promise.resolve(github as any)
    const git = await app.auth()

    // Test

    expect.assertions(5)

    const res = await createProjectSetupBranch(git, fixtures.repo, [
      fixtures.fileEmmaJSON,
    ])

    expect(github.gitdata.getReference).toHaveBeenCalledTimes(1)
    expect(github.gitdata.createBlob).toHaveBeenCalledTimes(1)
    expect(github.gitdata.createTree).toHaveBeenCalledTimes(1)
    expect(github.gitdata.updateReference).toHaveBeenCalledTimes(1)
    expect(res).toEqual(fixtures.response(fixtures.updateReferenceResponse))
  })

  test('createSetupPullRequest creates a setup pull request correctly.', async () => {
    const github = {
      pullRequests: {
        create: jest.fn(),
      },
    }

    app.auth = () => Promise.resolve(github as any)
    const git = await app.auth()

    // Test

    await createSetupPullRequest(git, fixtures.repo)

    expect(github.pullRequests.create).toHaveBeenCalledWith({
      owner: fixtures.repo.owner,
      repo: fixtures.repo.name,
      title: `Hey, it's Emma Boilerplates 👋`,
      head: 'emma/setup',
      base: 'master',
      body: config.setupPullRequestTemplate,
    })
  })

  test('getBoilerplateDefinitionForPath finds the correct definition', async () => {
    const github = {
      repos: {
        getContent: jest.fn().mockResolvedValue(fixtures.contents),
      },
    }

    app.auth = () => Promise.resolve(github as any)
    const git = await app.auth()

    const mock = jest.spyOn(utils, 'downloadFile')
    mock.mockImplementation(() => fixtures.definitionPublic)

    const res = await getBoilerplateDefinitionForPath(
      git,
      fixtures.repo,
      '/repo/path',
      { id: 'installation_id' },
    )

    expect(res).toEqual(fixtures.definitionPublic)

    mock.mockRestore()
  })

  test('getBoilerplateDefinitionForPath returns null whe missing package.json in boilerplate', async () => {
    const github = {
      repos: {
        getContent: jest.fn().mockResolvedValue([fixtures.content]),
      },
    }

    app.auth = () => Promise.resolve(github as any)
    const git = await app.auth()

    const mock = jest.spyOn(utils, 'downloadFile')
    mock.mockImplementation(() => fixtures.definitionPublic)

    const res = await getBoilerplateDefinitionForPath(
      git,
      fixtures.repo,
      '/repo/path',
      { id: 'installation_id' },
    )

    expect(res).toBeNull()

    mock.mockRestore()
  })
})
