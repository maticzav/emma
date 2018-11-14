import { GitHubAPI } from 'probot/lib/github'
import {
  PullRequestsCreateResponse,
  Response,
  GitdataCreateBlobResponse,
  GitdataCreateTreeResponse,
  GitdataUpdateReferenceResponse,
} from '@octokit/rest'
import { EmmaConfig } from 'emma-json-schema'

import * as config from './config'
import { parseConfig } from './parse'
import { dedupe, downloadFile } from './utils'

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

export interface GithubPartialRepository {
  id: string
  node_id: string
  name: string
  full_name: string
  private: boolean
}

/**
 *
 * Hydrates partial repository into a GithubRepository.
 * This is particularly useful with events which return partial
 * repository information.
 *
 * @param repository
 */
export function hydratePartialRepository(
  repository: GithubPartialRepository,
): GithubRepository {
  const owner = repository.full_name.replace(`/${repository.name}`, '')

  return {
    id: repository.id,
    node_id: repository.node_id,
    owner: owner,
    name: repository.name,
    full_name: repository.full_name,
    ref: 'master',
    private: repository.private,
  }
}

/**
 *
 * Finds the files which contain Emma configuration in repository.
 *
 * @param context
 * @param repository
 */
export async function getRepositoryConfiguration(
  github: GitHubAPI,
  repository: GithubRepository,
): Promise<EmmaConfig | null> {
  const repoRootContents = await getContents(github, repository)
  const configFiles = repoRootContents.filter(content =>
    config.emmaConfigNames.includes(content.name),
  )

  if (configFiles.length === 0) {
    return null
  }

  const configurations = await Promise.all(
    configFiles.map(file => downloadFile(file.download_url!)),
  )
  const configuration = mergeConfigurations(configurations)

  return configuration
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
 * Obtains a lits of boilerplates' paths that configuration describes.
 *
 * @param github
 * @param repository
 * @param config
 */
export async function getBoilerplatePathsFromConfiguration(
  github: GitHubAPI,
  repository: GithubRepository,
  config: EmmaConfig,
): Promise<string[]> {
  const pathsForGlob = await Promise.all(
    config.boilerplates.map(async glob =>
      parsePathsFromGitGlob(github, repository, glob),
    ),
  )

  const allPaths = pathsForGlob.reduce((acc, paths) => [...acc, ...paths], [])

  return allPaths
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
  return github.pullRequests.create({
    owner: repository.owner,
    repo: repository.name,
    title: `Hey, it's Emma Boilerplates 👋`,
    head: config.emmaSetupBranchHead,
    base: 'master',
    body: config.setupPullRequestTemplate,
  })
}

/**
 *
 * Branches
 *
 */

export type GithubReferenceType = 'commit'

export interface GithubReference {
  ref: string
  node_id: string
  url: string
  object: {
    type: GithubReferenceType
    sha: string
    url: string
  }
}

export type GithubBlobType = 'blob' | 'tree' | 'commit'

export type GithubBlobMode =
  | '100644'
  | '100755'
  | '040000'
  | '160000'
  | '120000'

export interface GithubBlob {
  path: string
  mode: GithubBlobMode
  type: GithubBlobType
  sha: string
}

export interface File {
  path: string
  content: string
  encoding: string
}

/**
 *
 * Creates a new branch containing the setup files.
 *
 * @param github
 * @param repository
 * @param files
 */
export async function createProjectSetupBranch(
  github: GitHubAPI,
  repository: GithubRepository,
  files: File[],
): Promise<Response<GitdataUpdateReferenceResponse>> {
  const branch = await createBranchReference(config.emmaSetupBranchHead)

  const blobs: GithubBlob[] = await Promise.all(
    files.map<Promise<GithubBlob>>(async file => {
      const blob = await createFileBlob(file)

      return {
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blob.data.sha,
      }
    }),
  )

  const commit = await createCommitWithBlobs(branch.data.object.sha, blobs)
  const push = await pushChangesToBranch(branch.data.ref, commit.data.sha)

  return push

  /**
   *
   * Functions which help with creation of project setup branch.
   *
   */

  async function createBranchReference(
    ref: string,
  ): Promise<Response<GithubReference>> {
    return github.gitdata.getReference({
      owner: repository.owner,
      repo: repository.name,
      ref,
    })
  }

  async function createFileBlob(
    file: File,
  ): Promise<Response<GitdataCreateBlobResponse>> {
    return github.gitdata.createBlob({
      owner: repository.owner,
      repo: repository.name,
      content: file.content,
      encoding: file.encoding,
    })
  }

  async function createCommitWithBlobs(
    sha: string,
    blobs: GithubBlob[],
  ): Promise<Response<GitdataCreateTreeResponse>> {
    return github.gitdata.createTree({
      owner: repository.owner,
      repo: repository.name,
      base_tree: sha,
      tree: blobs,
    })
  }

  async function pushChangesToBranch(
    sha: string,
    ref: string,
  ): Promise<Response<GitdataUpdateReferenceResponse>> {
    return github.gitdata.updateReference({
      owner: repository.owner,
      repo: repository.name,
      ref,
      sha,
      force: true,
    })
  }
}

/**
 *
 * Boilerplates
 *
 */

export interface PackageDefinition {
  name: string
  description: string
  private: boolean
  [key: string]: any
}

export interface GithubInstallation {
  id: string
}

/**
 *
 * Obtains boilerplate definition for given path.
 *
 * @param github
 * @param repository
 * @param path
 */
export async function getBoilerplateDefinitionForPath(
  github: GitHubAPI,
  repository: GithubRepository,
  path: string,
  installation: GithubInstallation,
): Promise<PackageDefinition | null> {
  const files = await getContents(github, repository, path)
  const definitionContent = files.find(file => file.name === 'package.json')

  if (!definitionContent) {
    return null
  } else {
    return downloadFile<PackageDefinition>(definitionContent.download_url!)
  }
}
