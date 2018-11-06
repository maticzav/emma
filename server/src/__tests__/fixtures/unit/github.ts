import {
  GithubRepository,
  GithubContent,
  File,
  GithubReference,
  PackageDefinition,
} from '../../../github'
import { EmmaConfig } from 'emma-json-schema'
import {
  Response,
  GitdataCreateBlobResponse,
  GitdataCreateTreeResponse,
  GitdataUpdateReferenceResponse,
} from '@octokit/rest'

/**
 *
 * Contents
 *
 */

export const content: GithubContent = {
  type: 'file',
  encoding: 'encoding',
  size: 2,
  name: 'ignored',
  path: 'path',
  content: 'content',
  sha: 'sha',
  url: 'url',
  git_url: 'git_url',
  html_url: 'html_url',
  download_url: 'download_url',
  _links: {
    git: 'git',
    self: 'self',
    html: 'html',
  },
}

export const contents: GithubContent[] = [
  {
    type: 'file',
    encoding: 'encoding',
    size: 2,
    name: 'package.json',
    path: 'path',
    content: 'content',
    sha: 'sha',
    url: 'url',
    git_url: 'git_url',
    html_url: 'html_url',
    download_url: 'download_url',
    _links: {
      git: 'git',
      self: 'self',
      html: 'html',
    },
  },
  {
    type: 'file',
    encoding: 'encoding',
    size: 2,
    name: 'file',
    path: 'path',
    content: 'content',
    sha: 'sha',
    url: 'url',
    git_url: 'git_url',
    html_url: 'html_url',
    download_url: 'download_url',
    _links: {
      git: 'git',
      self: 'self',
      html: 'html',
    },
  },
  {
    type: 'dir',
    encoding: 'encoding',
    size: 2,
    name: 'directory',
    path: 'path',
    content: 'content',
    sha: 'sha',
    url: 'url',
    git_url: 'git_url',
    html_url: 'html_url',
    download_url: 'download_url',
    _links: {
      git: 'git',
      self: 'self',
      html: 'html',
    },
  },
]

export const contentsFolders: GithubContent[] = [
  {
    type: 'file',
    encoding: 'encoding',
    size: 2,
    name: 'ignored',
    path: 'path',
    content: 'content',
    sha: 'sha',
    url: 'url',
    git_url: 'git_url',
    html_url: 'html_url',
    download_url: 'download_url',
    _links: {
      git: 'git',
      self: 'self',
      html: 'html',
    },
  },
  {
    type: 'dir',
    encoding: 'encoding',
    size: 2,
    name: 'folder-1',
    path: 'path',
    content: 'content',
    sha: 'sha',
    url: 'url',
    git_url: 'git_url',
    html_url: 'html_url',
    download_url: 'download_url',
    _links: {
      git: 'git',
      self: 'self',
      html: 'html',
    },
  },
  {
    type: 'dir',
    encoding: 'encoding',
    size: 2,
    name: 'folder-2',
    path: 'path',
    content: 'content',
    sha: 'sha',
    url: 'url',
    git_url: 'git_url',
    html_url: 'html_url',
    download_url: 'download_url',
    _links: {
      git: 'git',
      self: 'self',
      html: 'html',
    },
  },
]

/**
 *
 * Repositories
 *
 */

export const repo: GithubRepository = {
  id: 'id',
  node_id: 'node_id',
  name: 'emma',
  owner: 'maticzav',
  full_name: 'maticzav/emma',
  ref: 'master',
  private: false,
}

/**
 *
 * Configuration files
 *
 */

export const contentEmmaJson: GithubContent = {
  type: 'file',
  encoding: 'encoding',
  size: 2,
  name: 'emma.json',
  path: 'path',
  content: 'content',
  sha: 'sha',
  url: 'url',
  git_url: 'git_url',
  html_url: 'html_url',
  download_url: 'download_url',
  _links: {
    git: 'git',
    self: 'self',
    html: 'html',
  },
}

export const contentEmmarc: GithubContent = {
  type: 'file',
  encoding: 'encoding',
  size: 2,
  name: '.emmarc',
  path: 'path',
  content: 'content',
  sha: 'sha',
  url: 'url',
  git_url: 'git_url',
  html_url: 'html_url',
  download_url: 'download_url',
  _links: {
    git: 'git',
    self: 'self',
    html: 'html',
  },
}

export const contentEmmarcJson: GithubContent = {
  type: 'file',
  encoding: 'encoding',
  size: 2,
  name: '.emmarc.json',
  path: 'path',
  content: 'content',
  sha: 'sha',
  url: 'url',
  git_url: 'git_url',
  html_url: 'html_url',
  download_url: 'download_url',
  _links: {
    git: 'git',
    self: 'self',
    html: 'html',
  },
}

/**
 *
 * Configurations
 *
 */

export const configuration: EmmaConfig = {
  boilerplates: ['glob'],
}

export const configurations: EmmaConfig[] = [
  {
    boilerplates: ['glob'],
  },
  {
    boilerplates: ['glob', 'a/b/c'],
  },
  {
    boilerplates: ['glob', 'd/e/*'],
  },
]

export const invalidConfiguration: any = {
  foo: ['bar'],
}

/**
 *
 * Definitions
 *
 */

export const definitionPublic: PackageDefinition = {
  name: 'test-public-boilerplate',
  description: 'A very concise description.',
  private: false,
}

export const definitionPrivate: PackageDefinition = {
  name: 'test-private-boilerplate',
  description: 'A very concise description.',
  private: true,
}

/**
 *
 * Files
 *
 */

export const fileEmmaJSON: File = {
  content: JSON.stringify(configuration),
  encoding: 'utf-8',
  path: 'emma.json',
}

/**
 *
 * Response & Gitdata
 *
 */

export const response = <T>(res: T): Response<T> => ({
  data: res,
  status: 2,
  headers: {
    'x-ratelimit-limit': 'string',
    'x-ratelimit-remaining': 'string',
    'x-ratelimit-reset': 'string',
    'x-github-request-id': 'string',
    'x-github-media-type': 'string',
    link: 'string',
    'last-modified': 'string',
    etag: 'string',
    status: 'string',
  },

  [Symbol.iterator]: function*() {
    yield 1
  },
})

export const reference: GithubReference = {
  ref: 'test/test',
  node_id: 'node_id',
  url: 'url',
  object: {
    type: 'commit',
    sha: 'sha',
    url: 'url',
  },
}

export const createBlobResponse: GitdataCreateBlobResponse = {
  url: 'url',
  sha: 'sha',
}

export const createTreeResponse: GitdataCreateTreeResponse = {
  sha: 'sha',
  url: 'url',
  tree: [
    {
      mode: 'mode',
      url: 'url',
      type: 'type',
      size: 2,
      sha: 'sha',
      path: 'path',
    },
  ],
}

export const updateReferenceResponse: GitdataUpdateReferenceResponse = {
  url: 'url',
  ref: 'ref',
  node_id: 'node_id',
  object: {
    sha: 'sha',
    url: 'url',
    type: 'type',
  },
}
