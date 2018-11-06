import { Application } from 'probot'
import {
  parsePathsFromGitGlob,
  getContent,
  getContents,
  getRepositoryConfigurations,
  mergeConfigurations,
  createProjectSetupBranch,
  createSetupPullRequest,
  setupPullRequestTemplate,
  getBoilerplateDefinitionForPath,
} from '../../github'
import * as utils from '../../utils'

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
          .mockResolvedValue([
            fixtures.contentEmmaJson,
            fixtures.contentEmmarc,
            fixtures.contentEmmarcJson,
            fixtures.content,
          ]),
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
        getContent: jest.fn().mockResolvedValue(fixtures.contents),
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

    const analysis = 'analysis'
    await createSetupPullRequest(git, fixtures.repo, analysis)

    expect(github.pullRequests.create).toHaveBeenCalledWith({
      owner: fixtures.repo.owner,
      repo: fixtures.repo.name,
      title: `Hey, it's Emma Boilerplates 👋`,
      head: 'emma/setup',
      base: 'master',
      body: setupPullRequestTemplate(analysis),
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
      'installation_id',
    )

    expect(res).toEqual({
      name: fixtures.definitionPublic.name,
      description: fixtures.definitionPublic.description,
      path: '/repo/path',
      repository: {
        owner: fixtures.repo.owner,
        name: fixtures.repo.name,
        branch: fixtures.repo.ref,
      },
      installation: {
        id: 'installation_id',
      },
    })

    mock.mockRestore()
  })

  test('getBoilerplateDefinitionForPath throws on undefined module', async () => {
    const github = {
      repos: {
        getContent: jest.fn().mockResolvedValue([fixtures.content]),
      },
    }

    app.auth = () => Promise.resolve(github as any)
    const git = await app.auth()

    const mock = jest.spyOn(utils, 'downloadFile')
    mock.mockImplementation(() => fixtures.definitionPublic)

    const res = getBoilerplateDefinitionForPath(
      git,
      fixtures.repo,
      '/repo/path',
      'installation_id',
    )

    expect(res).rejects.toThrow()

    mock.mockRestore()
  })

  test('getBoilerplateDefinitionForPath throws on private', async () => {
    const github = {
      repos: {
        getContent: jest.fn().mockResolvedValue(fixtures.contents),
      },
    }

    app.auth = () => Promise.resolve(github as any)
    const git = await app.auth()

    const mock = jest.spyOn(utils, 'downloadFile')
    mock.mockImplementation(() => fixtures.definitionPrivate)

    const res = getBoilerplateDefinitionForPath(
      git,
      fixtures.repo,
      '/repo/path',
      'installation_id',
    )

    expect(res).rejects.toThrow()

    mock.mockRestore()
  })
})
