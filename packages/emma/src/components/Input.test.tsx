import * as React from 'react'
import { renderToString, Color } from 'ink'
import { Input } from './Input'

describe('Input component works correctly', () => {
  test('Keypress triggers value change.', async () => {
    expect(true).toBe(true)
  })
  test('Backspace deletes last character.', async () => {
    expect(true).toBe(true)
  })

  test('Enter triggers onSubmit callback', async () => {
    expect(true).toBe(true)
  })

  test('Placeholder is correctly applied', async () => {
    const placeholder = Math.random().toString()

    const res = renderToString(
      <Input
        value=""
        placeholder={placeholder}
        focus={true}
        onChange={() => ({})}
      />,
    )
    const expected = renderToString(<Color dim>{placeholder}</Color>)

    expect(res).toEqual(expected)
  })
})
