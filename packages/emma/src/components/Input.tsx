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

interface TextInputProps {
  value: string
  placeholder?: string
  focus?: boolean
  stdin: ReadStream
  setRawMode: (raw: boolean) => void
  onChange: (input: string) => void
  onSubmit?: (input: string) => void
}

class TextInput extends React.PureComponent<TextInputProps> {
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
        onChange(value.slice(0, -1))
        break
      case ' ':
        break
      default:
        onChange(value + char)
        break
    }
  }
}

interface InputProps {
  value: string
  placeholder?: string
  focus?: boolean
  onChange: (input: string) => void
  onSubmit?: (input: string) => void
}

export class Input extends React.PureComponent<InputProps> {
  render() {
    return (
      <StdinContext.Consumer>
        {({ stdin, setRawMode }) => (
          <TextInput {...this.props} stdin={stdin} setRawMode={setRawMode} />
        )}
      </StdinContext.Consumer>
    )
  }
}
