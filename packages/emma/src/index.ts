#! /usr/bin/env node

import * as meow from 'meow'
import * as notifier from 'update-notifier'
import * as readPkg from 'read-pkg'
import { render } from 'ink'

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
  Usage:
    $ emma

  It's that simple! Simply delightful.
`,
  {
    flags: {
      force: {
        alias: 'f',
        type: 'boolean',
        default: false,
      },
    },
  },
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
  let unmount: () => any = () => null

  /**
   * Require immediate update of Emma.
   */
  if (update.update) {
    update.notify()
    process.exit()
  }

  /**
   * Exception handlers
   */
  const onError = () => {
    unmount()
    process.exit(1)
  }

  const onExit = () => {
    unmount()
    process.exit()
  }

  /**
   *
   * Get package definition. If there exists package definition
   * start dependency manager, otherwise start boilerplate installer.
   *
   */
  try {
    const pkg = await readPkg()

    /**
     * Renders dependency manager.
     */
    unmount = render(commands.dependencyManager(pkg, onExit))
  } catch (err) {
    /**
     * Renders boilerplate installer.
     *  (reruns main after boilerplate installation to start dependency manager.)
     */
    unmount = render(commands.boilerplateInstaller(() => main(cli, update)))
  }
}
