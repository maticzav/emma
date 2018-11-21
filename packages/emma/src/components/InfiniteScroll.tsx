import * as React from 'react'
import * as PropTypes from 'prop-types'
import { StdinContext } from 'ink'
import { ReadStream } from 'fs'

/**
 *
 * Infinite Select
 *
 */

interface Props<T> extends InfiniteSelectProps<T> {
  stdin: ReadStream
  setRawMode: (raw: boolean) => void
}

interface State {
  cursor: number
}

class InfiniteScroll<T = {}> extends React.Component<Props<T>, State> {
  static propTypes = {
    items: PropTypes.array.isRequired,
    render: PropTypes.func.isRequired,
    focus: PropTypes.bool,
    size: PropTypes.number,
    onWillReachEnd: PropTypes.func,
    onReachedEnd: PropTypes.func,
    stdin: PropTypes.object.isRequired,
    setRawMode: PropTypes.func.isRequired,
  }

  static defaultProps = {
    focus: true,
    size: 5,
    onWillReachEnd: () => {},
    onReachedEnd: () => {},
  }

  /**
   *
   * State
   *
   */

  state: State = {
    cursor: 0,
  }

  /**
   *
   * Event handlers
   *
   */

  /**
   * TODO: Remove typings once React typings support getDerivedStateFromProps
   */
  static getDerivedStateFromProps<T>(
    props: Props<T>,
    state: State,
  ): State | null {
    /**
     * This ensures that cursor stays in sync with the most recent props
     */
    if (props.items.length < state.cursor) {
      return {
        ...state,
        cursor: props.items.length,
      }
    } else {
      return null
    }
  }

  componentDidMount() {
    const { stdin, setRawMode } = this.props

    setRawMode(true)
    stdin.on('data', this.handleKeyPress)
  }

  componentWillUnmount() {
    const { stdin, setRawMode } = this.props

    stdin.removeListener('data', this.handleKeyPress)
    setRawMode(false)
  }

  handleKeyPress = data => {
    const { focus, items } = this.props
    const { cursor } = this.state

    /**
     * Prevent any action if element not focused.
     */
    if (!focus) return

    /**
     * Decode input character.
     */
    const char = String(data)

    switch (char) {
      case '\u001B[A': {
        /** Arrow UP */
        if (cursor - 1 >= 0) this.setState({ cursor: cursor - 1 })
      }
      case '\u001B[B': {
        /** Arrow DOWN */
        if (cursor + 1 <= items.length) this.setState({ cursor: cursor + 1 })
      }
    }
  }

  componentDidUpdate<T>(props: Props<T>, state: State) {
    /**
     * Trigger onWillReachEnd on the second last item in the list.
     */
    if (state.cursor === props.items.length - 2) {
      this.props.onWillReachEnd()
    }

    /**
     * Trigger onReachedEnd once it reached it.
     */
    if (state.cursor === props.items.length) {
      this.props.onReachedEnd()
    }
  }

  /**
   *
   * Rendering
   *
   */

  render() {
    const { items, size, render: RenderItem } = this.props
    const { cursor } = this.state

    const mask = getMask(items, cursor, size)

    /**
     * Update active item, slice to mask
     */
    const renderedItems = filterMap(items, (item, i) => {
      /** Remove items which are not in mask */
      if (!(mask <= i && i <= mask + size)) {
        return null
      }

      /** Renders active item */
      if (i === cursor) {
        return <RenderItem key={i} {...item} active={true} />
      }

      /** Renders normal items */
      return <RenderItem key={i} {...item} active={false} />
    })

    return <div>{renderedItems}</div>

    /**
     * Helper functions
     */

    /**
     *
     * Maps the elements of a list using functions and filters the ones which
     * returned `null`.
     *
     * @param ts
     * @param fn
     */
    function filterMap<T, Y>(ts: T[], fn: (t: T, i: number) => Y | null): Y[] {
      return ts.map(fn).filter(t => t !== null)
    }

    /**
     *
     * Calculates the offset of the top border of the mask
     * from the top of the list.
     *
     * @param items
     * @param cursor
     * @param size
     */
    function getMask<T>(items: T[], cursor: number, size: number): number {
      /** Distance from the cursor to the top of mask. */
      const offset = Math.floor(size / 2)

      /** Items are shorter than mask. */
      if (items.length <= size) return 0

      /** Cursor has moved past the middle point of the mask. */
      if (cursor + offset >= items.length) return items.length - size

      /** Cursor has moved above the middle point of the mask. */
      if (cursor - offset <= 0) return 0

      /** Cursor is in the "middle" of the list. */
      return cursor - offset
    }
  }
}

interface InfiniteSelectProps<T> {
  /**
   *
   * - `items`: represents the list of all items
   * - `render`: describes how each item is rendered
   * - `focus`: whether UI is focused on element
   * - `size`: number of shown elements
   * - `onWillReachEnd`: called before reaching the end
   * - `onReachedEnd`: called when the end is reached
   *
   */
  items: T[]
  render: typeof React.Component
  focus?: boolean
  size?: number
  onWillReachEnd?: () => void
  onReachedEnd?: () => void
}

export default class<T> extends React.PureComponent<InfiniteSelectProps<T>> {
  render() {
    return (
      <StdinContext.Consumer>
        {({ stdin, setRawMode }) => (
          <InfiniteScroll
            {...this.props}
            stdin={stdin}
            setRawMode={setRawMode}
          />
        )}
      </StdinContext.Consumer>
    )
  }
}
