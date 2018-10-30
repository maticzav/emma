import * as Ajv from 'ajv'
import schema = require('../schema.json')
import * as fs from 'fs'
import * as path from 'path'

// SETUP

const ajv = new Ajv().addMetaSchema(
  require('ajv/lib/refs/json-schema-draft-06.json'),
)
const validateSchema = ajv.compile(schema)

export function parseConfig(path: string) {
  const file = fs.readFileSync(path, 'utf-8')

  if (!validateSchema(file)) {
    throw new Error(JSON.stringify(validateSchema.errors!, null, 2))
  }

  return file
}

test('emma config', () => {
  const config = path.join(__dirname, 'fixtures/emma.json')

  expect(parseConfig(config)).toMatchSnapshot()
})
