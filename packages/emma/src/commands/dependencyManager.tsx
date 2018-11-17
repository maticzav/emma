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
export class DependencyManager extends Component {}
