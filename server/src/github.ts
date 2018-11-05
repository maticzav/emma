import { GitHubAPI } from 'probot/lib/github'
import { PullRequestsCreateResponse, Response } from '@octokit/rest'
import { EmmaConfig } from 'emma-json-schema'

import { emmaConfigNames } from './config'
import { parseConfig } from './parse'
import { dedupe } from './utils'

/**
 *
 * Repositories
 *
 */

export interface GithubRepository {
  id: string
  node_id: string
  owner: string
  name: string
  full_name: string
  ref: string
  private: boolean
}

/**
 *
 * Finds the files which contain Emma configuration in repository.
 *
 * @param context
 * @param repository
 */
export async function getRepositoryConfigurations(
  github: GitHubAPI,
  repository: GithubRepository,
): Promise<GithubContent[] | null> {
  const repoRootContents = await getContents(github, repository)

  const configFiles = repoRootContents.filter(content =>
    emmaConfigNames.includes(content.name),
  )

  if (configFiles.length === 0) {
    return null
  } else {
    return configFiles
  }
}

/**
 *
 * Merges multiple Emma configurations into one.
 *
 * @param configurations
 */
export function mergeConfigurations(configurations: EmmaConfig[]): EmmaConfig {
  const configuration = configurations.reduce<EmmaConfig>(
    (acc, config) => {
      const validatedConfig = parseConfig(config)

      if (validatedConfig) {
        return {
          boilerplates: dedupe([
            ...acc.boilerplates,
            ...validatedConfig.boilerplates,
          ]),
        }
      } else {
        return acc
      }
    },
    { boilerplates: [] },
  )

  return configuration
}

/**
 *
 * Github Content types
 *
 */

export type GithubContentType = 'file' | 'dir' | 'symlink'

export interface GithubContent {
  type: GithubContentType
  encoding: string
  size: number
  name: string
  path: string
  content: string
  sha: string
  url: string
  git_url: string
  html_url: string
  download_url: string | null
  _links: {
    git: string
    self: string
    html: string
  }
}

/**
 *
 * Obtains a file information from GitHub.
 *
 * @param context
 * @param ref
 * @param file
 */
export async function getContent(
  github: GitHubAPI,
  repo: GithubRepository,
  path: string,
): Promise<GithubContent> {
  const res = await github.repos.getContent({
    owner: repo.owner,
    repo: repo.name,
    ref: repo.ref,
    path: path,
  })

  if (res instanceof Array) {
    throw new Error(`Provided path is not a file. ${path}`)
  }

  return res as any
}

/**
 *
 * Obtains a folder information from GitHub.
 *
 * @param context
 * @param ref
 * @param file
 */
export async function getContents(
  github: GitHubAPI,
  repo: GithubRepository,
  path: string = '',
): Promise<GithubContent[]> {
  const res = await github.repos.getContent({
    owner: repo.owner,
    repo: repo.name,
    ref: repo.ref,
    path: path,
  })

  if (!(res instanceof Array)) {
    throw new Error(`Provided path is not a folder. ${path}`)
  }

  return res as any
}

/**
 *
 * Globs
 *
 */

/**
 *
 * Parses possible relative Github URLs by filling globs (*).
 *
 * @param github
 * @param repository
 * @param path
 */
export async function parsePathsFromGitGlob(
  github: GitHubAPI,
  repository: GithubRepository,
  path: string,
): Promise<string[]> {
  const glob = path.split('/')

  return parseGlob(glob, '')

  // Functions which help with the execution of algorithm.

  /**
   *
   * Recursively fills the gaps and constructs paths.
   *
   * @param glob
   * @param path
   */
  async function parseGlob(glob: string[], path: string): Promise<string[]> {
    const [head, ...tail] = glob

    switch (head) {
      /**
       * When it reaches filler.
       */
      case '*': {
        const subfolders = await getPossibleSubfoldersForPath(path)

        const pathsTree = await Promise.all(
          subfolders.map(async subfolder => {
            const paths = await parseGlob(tail, appendChunk(path, subfolder))
            return {
              head: subfolder,
              paths,
            }
          }),
        )

        const paths = pathsTree.reduce<string[]>(
          (acc, tree) => [
            ...acc,
            ...tree.paths.map(path => prependChunk(path, tree.head)),
          ],
          [],
        )

        return paths
      }
      /**
       * Once it reaches the end of glob.
       */
      case undefined: {
        return ['']
      }
      /**
       * Regular path.
       */
      default: {
        const paths = await parseGlob(tail, appendChunk(path, head))

        return paths.map(path => prependChunk(path, head))
      }
    }
  }

  /**
   *
   * Appends a chunk at the end of a path.
   *
   * @param path
   * @param chunk
   */
  function appendChunk(path: string, chunk: string): string {
    if (path) return [path, chunk].join('/')
    else return chunk
  }

  /**
   *
   * Prepends chunk at the beginning of the path.
   *
   * @param path
   * @param chunk
   */
  function prependChunk(path: string, chunk: string): string {
    if (path) return [chunk, path].join('/')
    else return chunk
  }

  /**
   *
   * Finds possible continuations for particular path.
   *
   * @param path
   */
  async function getPossibleSubfoldersForPath(path: string): Promise<string[]> {
    return getContents(github, repository, path).then(contents => {
      return contents
        .filter(content => content.type === 'dir')
        .map(content => content.name)
    })
  }
}

/**
 *
 * Pull requests
 *
 */

/**
 *
 * Creates a setup pull request.
 *
 * @param github
 * @param repository
 */
export async function createSetupPullRequest(
  github: GitHubAPI,
  repository: GithubRepository,
): Promise<Response<PullRequestsCreateResponse>> {
  const body = `
    # Emma configuration

    > This is an autogenerated pull request.

    We are happy to see you decided to use Emma Boilerplates.
    This PR contains everything you need to setup your Boilerplates.

    Let us know if you need any help by openning an issue on
    https://github.com/maticzav/emma
  `

  return github.pullRequests.create({
    owner: repository.owner,
    repo: repository.name,
    title: `Hey, it's Emma Boilerplates 👋`,
    head: 'emma/setup',
    base: 'master',
    body,
  })
}

/**
 *
 * Branches
 *
 */
