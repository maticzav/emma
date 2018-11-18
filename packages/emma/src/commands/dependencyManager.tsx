import { Component } from 'react'

export interface IDependency {
  name: string
  version: string
  type: 'normal' | 'development' | 'peer'
}

/**
 *
 * Main component definition.
 *
 */

interface Props {}

interface State {
  dependencies: IDependency[]
}

export class DependencyManager extends Component<Props, State> {
  state: State = {
    dependencies: [],
  }

  constructor(props) {
    super(props)
  }

  render() {
    return 'fo'
  }
}
