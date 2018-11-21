import * as React from 'react'
import { Box, Color } from 'ink'
import { Map } from 'immutable'
import { Package } from 'read-pkg'

import Input from '../components/Input'
import InfiniteScroll from '../components/InfiniteScroll'

/**
 *
 * Main component definition.
 *
 */

interface Props {
  pkg: Package
  onComplete: () => void
}

interface State {
  input: string
  dependencies: Map<string, IDependency>
}

class DependencyManager extends React.Component<Props, State> {
  /**
   *
   * State
   *
   */

  constructor(props) {
    super(props)

    const { pkg } = this.props

    this.state = {
      input: '',
      dependencies: Map(), //normalisePackageDependencies(pkg),
    }
  }

  state: State = {
    input: '',
    dependencies: Map(),
  }

  /**
   *
   * Event handlers
   *
   */

  handleInputChange = input => {
    this.setState({
      input,
    })
  }

  handleSubmit = () => {
    const { input } = this.state

    if (input.length === 0) {
      this.handleInstall()
    } else {
      this.setState({
        input: '',
      })
    }
  }

  handleDependencyToggle = (name: string) => {
    const dependency = this.state.dependencies.get('name')

    if (!dependency) {
      /**
       * Create a new normal dependency if not yet indexed in the map.
       */
      this.setState({
        dependencies: this.state.dependencies.set(name, {
          name: name,
          type: 'normal',
        }),
      })
    } else {
      /**
       * Toggle the dependency type according to its current type.
       */
      this.setState({
        dependencies: this.state.dependencies.set(
          name,
          toggleDependency(dependency),
        ),
      })
    }
  }

  /** Render of main component */

  render() {
    return (
      <div>
        <Box>
          <Color rgb={[0, 255, 255]}>{`Search packages: `}</Color>
          <Input
            value={this.state.input}
            placeholder="Start typing..."
            focus={true}
            onChange={this.handleInputChange}
            onSubmit={this.handleSubmit}
          />
        </Box>
        <Box>
          <InfiniteScroll
            items={[
              { n: 1 },
              { n: 2 },
              { n: 3 },
              { n: 4 },
              { n: 5 },
              { n: 6 },
              { n: 7 },
              { n: 8 },
              { n: 9 },
              { n: 10 },
            ]}
            render={Item}
            size={5}
          />
          {/* <DependencySearch
            input={this.state.input}
            onClick={this.handleDependencyToggle}
          /> */}
        </Box>
        <div>Powered by Algolia.</div>
      </div>
    )
  }

  /**
   *
   * Installation
   *
   */

  async handleInstall() {
    return
  }
}

class Item extends React.Component<{ n: number; focus: boolean }> {
  render() {
    return (
      <Color dim={!this.props.focus}>{`${this.props.n}-${
        this.props.focus
      }`}</Color>
    )
  }
}

/**
 *
 * Dependency manager function.
 *
 * @param pkg
 */
export function dependencyManager(pkg: Package, onComplete?: () => void) {
  return <DependencyManager pkg={pkg} onComplete={onComplete} />
}

/**
 *
 * Helper functions
 *
 */

interface IDependency {
  name: string
  type: 'normal' | 'development'
}

function normalisePackageDependencies(pkg: Package): Map<string, IDependency> {
  /**
   * Obtain dependencies from package.json
   */
  const dependencies = reduceDependencies(pkg.dependencies, 'normal')
  const developmentDependencies = reduceDependencies(
    pkg.devDependencies,
    'development',
  )

  return Map({
    ...dependencies,
    ...developmentDependencies,
  })

  /**
   * Helper functions
   */

  function reduceDependencies(
    obj: { [key: string]: string },
    type: IDependency['type'],
  ): {
    [key: string]: IDependency
  } {
    return Object.values(pkg.dependencies).reduce(
      (acc, dependency) => ({
        ...acc,
        [dependency]: {
          name: dependency,
          type: 'normal',
        },
      }),
      {},
    )
  }
}

/**
 *
 * Modifies dependency so that it's toggled accordingly to its previous state.
 *
 * @param dependency
 */
function toggleDependency(dependency: IDependency): IDependency | null {
  switch (dependency.type) {
    case 'normal':
      return {
        name: name,
        type: 'development',
      }
      break
    case 'development':
      return null
      break
  }
}
