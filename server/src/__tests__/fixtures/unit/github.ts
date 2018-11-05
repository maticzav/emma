import { GithubRepository, GithubContent } from '../../../github'
import { EmmaConfig } from 'emma-json-schema'

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
