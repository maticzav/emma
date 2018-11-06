import { GitHubAPI } from 'probot/lib/github'
import {
  PullRequestsCreateResponse,
  Response,
  GitdataCreateBlobResponse,
  GitdataCreateTreeResponse,
  GitdataUpdateReferenceResponse,
} from '@octokit/rest'
import { EmmaConfig } from 'emma-json-schema'

import { emmaConfigNames } from './config'
import { parseConfig } from './parse'
import { dedupe, downloadFile } from './utils'
import { Boilerplate } from './models/boilerplate'

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
  analysis: string,
): Promise<Response<PullRequestsCreateResponse>> {
  return github.pullRequests.create({
    owner: repository.owner,
    repo: repository.name,
    title: `Hey, it's Emma Boilerplates 👋`,
    head: 'emma/setup',
    base: 'master',
    body: setupPullRequestTemplate(analysis),
  })
}

export const setupPullRequestTemplate = (analysis: string) => `
# Emma configuration

> This is an autogenerated pull request.

We are happy to see you decided to use Emma Boilerplates.
This PR contains everything you need to setup your Boilerplates.

Let us know if you need any help by openning an issue on
https://github.com/maticzav/emma

${analysis}
`

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

export async function createProjectSetupBranch(
  github: GitHubAPI,
  repository: GithubRepository,
  files: File[],
): Promise<Response<GitdataUpdateReferenceResponse>> {
  const branch = await createBranchReference('emma/setup')

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
  installation: string,
): Promise<Boilerplate> {
  try {
    const files = await getContents(github, repository, path)

    const definitionContent = files.find(file => file.name === 'package.json')

    if (!definitionContent) {
      throw new Error(`Missing package.json file.`)
    }

    const definition: PackageDefinition = await downloadFile(
      definitionContent.download_url!,
    )

    if (definition.private) {
      throw new Error(`Found private module.`)
    }

    return {
      name: definition.name,
      description: definition.description,
      path: path,
      repository: {
        owner: repository.owner,
        name: repository.name,
        branch: repository.ref,
      },
      installation: {
        id: installation,
      },
    }
  } catch (err) {
    throw new Error(`No boilerplate definition found at ${path}`)
  }
}
