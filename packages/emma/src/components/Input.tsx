import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Color } from 'ink'
import hasAnsi = require('has-ansi')

interface Props {
  value: string
  focus?: boolean
  placeholder?: string
  onChange?: (input: string) => any
  onSubmit?: (input: string) => any
}

/**
 *
 * Input component
 *
 */
export class Input extends React.Component<Props> {
  static propTypes = {
    value: PropTypes.string.isRequired,
    focus: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    placeholder: '',
    focus: true,
  }

  constructor(props) {
    super(props)

    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  /**
   *
   * Event subscriptions.
   *
   */
  componentDidMount() {
    process.stdin.on('keypress', this.handleKeyPress)
  }

  componentWillUnmount() {
    process.stdin.removeListener('keypress', this.handleKeyPress)
  }

  /**
   *
   * Handles key press event.
   *
   * @param ch
   * @param key
   */
  handleKeyPress(ch, key) {
    if (!this.props.focus) {
      return
    }

    if (hasAnsi(key.sequence)) {
      return
    }

    const { value, onChange, onSubmit } = this.props

    if (key.name === 'return') {
      onSubmit(value)
      return
    }

    if (key.name === 'backspace') {
      onChange(value.slice(0, -1))
      return
    }

    if (key.sequence === ch && /^.*$/.test(ch) && !key.ctrl) {
      onChange(value + ch)
    }
  }

  /**
   *
   * Rendering function.
   *
   */
  render() {
    const { value, placeholder } = this.props
    const hasValue = value.length > 0

    return (
      <Color hex={hasValue ? '#ffffff' : '#757B82'}>
        {hasValue ? value : placeholder}
      </Color>
    )
  }
}
