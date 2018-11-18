import * as React from 'react'
import { Package } from 'read-pkg'
import { Color, Text, Box } from 'ink'

import { Input } from '../components/Input'

interface IDependency {
  name: string
  version: string
  type: 'normal' | 'development' | 'peer'
}

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
  state: State = {
    input: '',
    dependencies: new Map(),
  }

  handleInputChange = input => {
    this.setState({
      input,
    })
  }

  handleInputSubmit = () => {
    console.log('foo')
  }

  render() {
    return (
      <Box>
        <Color rgb={[0, 255, 255]}>{`Search packages: `}</Color>
        <Input
          value={this.state.input}
          placeholder="Type to search..."
          focus={true}
          onChange={this.handleInputChange}
        />
      </Box>
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

export function normalisePackageDependencies(dependencies: {
  [key: string]: string
}): IDependency[] {
  return []
}
