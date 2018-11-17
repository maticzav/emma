#! /usr/bin/env node

import * as meow from 'meow'
import * as notifier from 'update-notifier'
import render from 'react-cli-renderer'

import * as commands from './commands'

/**
 *
 * Definition and execution of the CLI tool.
 *  1. checks for updates to the tool,
 *  2. obtains a package.json file if exists,
 *  3. manages packages or boilerplate.
 */
const cli = meow(
  `

`,
  {},
)

// Checks for updates of tool.
const update = notifier({ pkg: cli.pkg })

// Runs the application
main(cli, update)

/**
 *
 * The main execution context of the cli application.
 *
 * @param cli
 */
async function main(
  cli: meow.Result,
  update: notifier.UpdateNotifier,
): Promise<void> {
  const isModule = 0

  render(commands.DependencyManager)

  /**
   * Helper function
   */
  function getPackageJSONDefinition() {
    return
  }
}
