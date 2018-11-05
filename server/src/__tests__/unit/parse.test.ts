import * as fs from 'fs'
import * as path from 'path'
import { EmmaConfig } from 'emma-json-schema'
import { parseConfig } from '../../parse'

describe('Parse functions work accordingly', () => {
  test('parseConfig parses the configuration', async () => {
    const config = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../fixtures/unit/emma.json'),
        'utf-8',
      ),
    ) as EmmaConfig

    const parsed = parseConfig(config)

    expect(parsed).toEqual({
      boilerplates: ['boilerplates/*'],
    })
  })

  test('parseConfig does not parse invalid configuration', async () => {
    const config = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../fixtures/unit/emma.invalid.json'),
        'utf-8',
      ),
    ) as EmmaConfig

    const parsed = parseConfig(config)

    expect(parsed).toEqual(null)
  })
})
