import { Context } from 'probot'
import { EmmaConfig } from 'emma-json-schema'
import { emmaConfigNames } from './config'
import { getFirst, downloadFile } from './utils'
import { parseConfig } from './parse'
import { GitHubAPI } from 'probot/lib/github'

export interface GithubRepository {
  id: string
  node_id: string
  name: string
  full_name: string
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
): Promise<EmmaConfig | null> {
  const possibleConfigurationFiles = await Promise.all(
    emmaConfigNames.map(file => getContent(github, repository, file)),
  )

  const possibleConfigurations = await Promise.all(
    possibleConfigurationFiles
      .filter(file => file.download_url !== null)
      .map(async possibleConfigurationFile => {
        const file = await downloadFile<EmmaConfig>(
          possibleConfigurationFile.download_url!,
        )

        return file
      }),
  )

  const configuration = getFirst(
    possibleConfigurations,
    config => parseConfig(config) !== null,
  )

  return configuration
}

enum GithubContentType {
  'file',
  'dir',
  'symlink',
}

interface GithubContent {
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
async function getContent(
  github: GitHubAPI,
  repo: GithubRepository,
  file: string,
): Promise<GithubContent> {
  const res = await github.repos.getContent({
    owner: repo.owner,
    repo: repo.name,
    ref: repo.ref,
    path: file,
  })

  return res as any
}
