import { GitHubAPI } from 'probot/lib/github'
import { EmmaConfig } from 'emma-json-schema'

import { emmaConfigNames } from './config'
import { downloadFile, dedupe } from './utils'
import { parseConfig } from './parse'

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
 * @param context
 * @param repository
 */
export async function getRepositoryConfiguration(
  github: GitHubAPI,
  repository: GithubRepository,
): Promise<EmmaConfig> {
  const repoRootContents = await getContents(github, repository, '')

  const configFiles = repoRootContents.filter(content =>
    emmaConfigNames.includes(content.name),
  )

  if (configFiles.length === 0) {
    throw new Error('No config file found.')
  }

  const configurations: EmmaConfig[] = await Promise.all(
    configFiles.map(async file => downloadFile(file.download_url!)),
  )

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
 * @param context
 * @param ref
 * @param file
 */
export async function getContents(
  github: GitHubAPI,
  repo: GithubRepository,
  path: string,
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
