import { Application } from 'probot'

import { installPartialRepository, installRepository } from '../../emma'

import prisma from '../../prisma'
import * as github from '../../github'
import * as emma from '../../emma'

import * as fixtures from '../fixtures/unit/github'

describe('Emma works accordingly', () => {
  let app: Application

  beforeEach(() => {
    app = new Application()
  })

  describe('Repository installation works as expected', () => {
    test.skip('installPartialRepository hydrates partial repository correctly and returns installRepostiory', async () => {
      /**
       * Github
       */
      const git = {}
      app.auth = () => Promise.resolve(git as any)
      const auth = await app.auth()

      /**
       * Mocks
       */
      const mock = jest.spyOn(emma, 'installRepository')
      mock.mockImplementation(() => Promise.resolve())

      const res = installPartialRepository(
        auth,
        fixtures.partialRepo,
        fixtures.installation,
      )

      await expect(mock).toBeCalledWith(
        auth,
        fixtures.repo,
        fixtures.installation,
      )
    })

    test('installRepository installs boilerplates if configuration is valid', async () => {
      /**
       * Github setup
       */
      const git = {}
      app.auth = () => Promise.resolve(github as any)
      const auth = await app.auth()

      /**
       * Function mocks
       */
      const createRepositoryMock = jest.spyOn(prisma, 'createRepository')
      createRepositoryMock.mockImplementation(() => Promise.resolve())

      const getRepositoryConfigurationMock = jest.spyOn(
        github,
        'getRepositoryConfiguration',
      )
      getRepositoryConfigurationMock.mockImplementation(() =>
        Promise.resolve(fixtures.configuration),
      )

      const installBoilerplateMock = jest.spyOn(emma, 'installBoilerplate')
      installBoilerplateMock
        .mockImplementationOnce(() =>
          Promise.resolve({
            status: 'ok',
            message: 'Installed repository.',
          }),
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            status: 'error',
            message: 'Something went wrong.',
          }),
        )

      // Test

      const res = await installRepository(
        auth,
        fixtures.repo,
        fixtures.installation,
      )

      expect(res).toEqual({
        messages: ['Installed repository.'],
        errors: ['Something went wrong.'],
      })

      createRepositoryMock.mockRestore()
      getRepositoryConfigurationMock.mockRestore()
      installBoilerplateMock.mockRestore()
    })

    test('installRepository returns missing configuration message if no configuration is found', async () => {})

    test('installRepository returns invalid configuration message if no boilerplate paths are found', async () => {})
  })

  describe('Boilerplate installation works as expected', () => {
    // test('installBoilerplate')
  })
})
