import * as React from 'react'
import { Package } from 'read-pkg'
import { Input } from '../components/Input'
import { Color, Text, Box } from 'ink'

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

  constructor(props) {
    super(props)
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
      <div>
        <Box>
          <Color rgb={[0, 255, 255]}>{`Search packages: `}</Color>
          <Input
            value={this.state.input}
            placeholder="Type to search..."
            focus={true}
            onChange={this.handleInputChange}
            onSubmit={this.handleInputSubmit}
          />
        </Box>
        <div>"Dependency manager"</div>
        <div>Powered by Algolia.</div>
      </div>
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
