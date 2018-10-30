import * as tar from 'tar'
import * as tmp from 'tmp'
import * as github from 'parse-github-url'
import * as fs from 'fs'
import * as ora from 'ora'
import * as request from 'request'
import * as execa from 'execa'
import chalk from 'chalk'

import { Boilerplate } from './boilerplates'

export interface LoadOptions {
  installDependencies: boolean
}

export async function loadEmmaBoilerplate(
  boilerplate: Boilerplate,
  output: string,
  options: LoadOptions,
): Promise<void> {
  const tar = getBoilerplateRepositoryTarInformation(boilerplate)
  const tmp = await downloadRepository(tar)

  await extractBoilerplateFromRepository(tmp, tar, output)

  if (options.installDependencies) {
    await installBoilerplate(output)
  }

  printHelpMessage()
}

interface BoilerplateRepositoryTarInformation {
  uri: string
  files: string
}

function getBoilerplateRepositoryTarInformation(
  boilerplate: Boilerplate,
): BoilerplateRepositoryTarInformation {
  const meta = github(boilerplate.repo.uri)

  const uri = [
    `https://api.github.com/repos`,
    meta.repo,
    'tarball',
    boilerplate.repo.branch,
  ].join('/')

  return { uri, files: boilerplate.repo.path }
}

async function downloadRepository(
  tar: BoilerplateRepositoryTarInformation,
): Promise<string> {
  const spinner = ora(
    `Downloading boilerplate from ${chalk.cyan(tar.uri)}`,
  ).start()

  const tmpPath = tmp.fileSync({
    postfix: '.tar.gz',
  })

  await new Promise(resolve => {
    request(tar.uri, {
      headers: {
        'User-Agent': 'maticzav/emma',
      },
    })
      .pipe(fs.createWriteStream(tmpPath.name))
      .on('close', resolve)
  })

  spinner.succeed()

  return tmpPath.name
}

async function extractBoilerplateFromRepository(
  tmp: string,
  repo: BoilerplateRepositoryTarInformation,
  output: string,
): Promise<void> {
  const spinner = ora(`Extracting content to ${chalk.cyan(output)}`)

  await tar.extract({
    file: tmp,
    cwd: output,
    filter: path => RegExp(repo.files).test(path),
    strip: repo.files.split('/').length,
  })

  spinner.succeed()

  return
}

async function installBoilerplate(path: string): Promise<void> {
  const spinner = ora(`Installing dependencies 👩‍🚀`).start()

  process.chdir(path)

  try {
    if (await isYarnInstalled()) {
      await execa.shellSync('yarnpkg install', { stdio: `ignore` })
    } else {
      await execa.shellSync('npm install', { stdio: `ignore` })
    }

    spinner.succeed()
  } catch (err) {
    spinner.fail()
  }
}

async function isYarnInstalled(): Promise<boolean> {
  try {
    await execa.shell(`yarnpkg --version`, { stdio: `ignore` })
    return true
  } catch (err) {
    return false
  }
}

function printHelpMessage(): void {
  const message = `
Your GraphQL server has been successfully set up!

Run ${chalk.yellow(`yarn start`)} to start your GraphQL server.
`

  console.log(message)
}
