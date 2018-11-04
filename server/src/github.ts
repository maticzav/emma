import { Context } from 'probot'
import fetch from 'isomorphic-fetch'
import { EmmaConfig } from 'emma-json-schema'
import { emmaConfigNames } from './config'
import { getFirst } from './utils'
import { parseConfig } from './parse'

/**
 *
 * @param context
 * @param repository
 */
export async function getConfiguration(
  context: Context,
  ref: string,
): Promise<EmmaConfig | null> {
  const possibleConfigurationFiles = await Promise.all(
    emmaConfigNames.map(file => getContentFromRepository(context, ref, file)),
  )

  const possibleConfigurations = await Promise.all(
    possibleConfigurationFiles
      .filter(file => file.download_url !== null)
      .map(async possibleConfigurationFile => {
        const file = (await downloadFile(
          possibleConfigurationFile.download_url!,
        )) as EmmaConfig

        return file
      }),
  )

  const configuration = getFirst(
    possibleConfigurations,
    config => parseConfig(config) !== null,
  )

  return configuration
}

async function downloadFile<T = any>(uri: string): Promise<T> {
  return fetch(uri).then(res => res.json())
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
async function getContentFromRepository(
  context: Context,
  ref: string,
  file: string,
): Promise<GithubContent> {
  const repo = context.repo()
  const res = await context.github.repos.getContent({
    owner: repo.owner,
    repo: repo.repo,
    ref: ref,
    path: file,
  })

  return res as any
}

/**
 *
 * @param context
 */
function changedEmmaConfiguration(context: Context): boolean {
  const { commits } = context.payload

  commits.some()

  return true

  // Functions which help with the execution of this algorithm.

  function hasEmmaConfigInChangedFiles(files: string[]) {
    return files.some(file => emmaConfigNames.includes(file))
  }
}
