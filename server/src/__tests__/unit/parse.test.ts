import * as fs from 'fs'
import * as path from 'path'
import { EmmaConfig } from 'emma-json-schema'
import { parseConfig, parsePath } from '../../parse'

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

  test('parsePath parses paths correctly', async t => {
    const paths = [
      'test/*',
      'foo/slask/*',
      './bar/something/*',
      './abc',
      '.',
      'test',
    ]

    const parsedPaths = paths.map(path => parsePath(path))

    expect(parsedPaths).toEqual([
      'test',
      'foo/slack',
      'bar/something',
      'abc',
      '',
      'test',
    ])
  })
})
