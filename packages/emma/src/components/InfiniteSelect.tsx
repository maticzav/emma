import * as React from 'react'

interface Props<T> {
  options: T[]
  selected: (option: T) => boolean
  onToggle: (option: T) => any
}

/**
 *
 * Infinite Select
 *
 */
export class InfiniteSelect<T = {}> extends React.Component<Props<T>> {}
