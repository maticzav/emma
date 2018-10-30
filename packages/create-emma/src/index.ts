#!/usr/bin/env node

import * as path from 'path'
import * as fs from 'fs'
import * as meow from 'meow'
import * as inquirer from 'inquirer'

import { loadEmmaBoilerplate } from './loader'
import { defaultBoilerplate } from './boilerplates'

const cli = meow(
  `
    create-emma [dir]

    > Scaffolds the initial files of your project.

    Options:
      --no-install Skips dependency installation.
      --force (-f) Overwrites existing files.
`,
  {
    flags: {
      'no-install': {
        type: 'boolean',
        default: false,
      },
      force: {
        type: 'boolean',
        default: false,
        alias: 'f',
      },
    },
  },
)

main(cli)

// Main

async function main(cli: meow.Result) {
  let [output] = cli.input

  interface PathResponse {
    path: string
  }

  if (!output) {
    const res = await inquirer.prompt<PathResponse>([
      {
        name: 'path',
        message: 'Where should we scaffold graphql server?',
        type: 'input',
      },
    ])

    output = res.path
  }

  if (fs.existsSync(output)) {
    const allowedFiles = ['.git', '.gitignore']
    const conflictingFiles = fs
      .readdirSync(output)
      .filter(f => !allowedFiles.includes(f))

    if (conflictingFiles.length > 0 && !cli.flags.force) {
      console.log(`Directory ${output} must be empty.`)
      return
    }
  } else {
    fs.mkdirSync(output)
  }

  loadEmmaBoilerplate(defaultBoilerplate, path.resolve(output), {
    installDependencies: !cli.flags['no-install'],
  })
}
