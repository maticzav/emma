import { Context } from 'probot'
import { EmmaConfig } from 'emma-json-schema'
import { emmaConfigNames } from './config'

function changedEmmaConfiguration(context: Context): boolean {
  const { commits } = context.payload

  commits.some()

  return true

  // Functions which help with the execution of this algorithm.

  function hasEmmaConfigInChangedFiles(files: string[]) {
    return files.some(file => emmaConfigNames.includes(file))
  }
}

async function getEmmaConfiguration(
  context: Context,
  ref = 'master',
): Promise<EmmaConfig> {
  const contents = emmaConfigNames.map(file =>
    getContentFromRepository(context, ref, file),
  )
  const files = await Promise.all(contents)

  return
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
