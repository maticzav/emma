/**
 *
 * Taken from vadimdemedes/ink-text-input.
 *
 */
import * as React from 'react'
import * as PropTypes from 'prop-types'
import { ReadStream } from 'fs'
import { Color, StdinContext } from 'ink'
import hasAnsi = require('has-ansi')

/**
 *
 * Inner component, listener
 *
 */

interface Props extends InputProps {
  stdin: ReadStream
  setRawMode: (raw: boolean) => void
}

class Input extends React.PureComponent<Props> {
  static propTypes = {
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    focus: PropTypes.bool,
    stdin: PropTypes.object.isRequired,
    setRawMode: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    placeholder: '',
    focus: true,
    onSubmit: () => ({}),
  }

  render() {
    const { value, placeholder } = this.props
    const hasValue = value.length > 0

    return <Color dim={!hasValue}>{hasValue ? value : placeholder}</Color>
  }

  /**
   *
   * Event handlers
   *
   */

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

  /**
   *
   * Input handler
   *
   */
  handleKeyPress = data => {
    const { value, focus, onChange, onSubmit } = this.props

    const ARROW_UP = '\u001B[A'
    const ARROW_DOWN = '\u001B[B'
    const ARROW_LEFT = '\u001B[D'
    const ARROW_RIGHT = '\u001B[C'
    const TAB = '\t'
    const CTRL_C = '\x03'

    /**
     * Prevent any action if element not focused.
     */
    if (!focus) return

    /**
     * Decode input character.
     */
    const char = String(data)

    switch (char) {
      case '\r':
        /** Enter  */
        onSubmit(value)
        break

      case '\x08':
      case '\x7F':
        /** Backspace */
        onChange(value.slice(0, -1))
        break
      case TAB:
      case ARROW_DOWN:
      case ARROW_LEFT:
      case ARROW_RIGHT:
      case ARROW_UP:
      case CTRL_C:
        /** Ignored */
        break
      default:
        onChange(value + char)
        break
    }
  }
}

/**
 *
 * Input
 *
 */

interface InputProps {
  value: string
  placeholder?: string
  focus?: boolean
  onChange: (input: string) => void
  onSubmit?: (input: string) => void
}

export default class extends React.PureComponent<InputProps> {
  render() {
    return (
      <StdinContext.Consumer>
        {({ stdin, setRawMode }) => (
          <Input {...this.props} stdin={stdin} setRawMode={setRawMode} />
        )}
      </StdinContext.Consumer>
    )
  }
}
