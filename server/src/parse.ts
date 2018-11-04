import Ajv from 'ajv'
import { EmmaConfig } from 'emma-json-schema'
import schema = require('emma-json-schema/dist/schema.json')

const ajv = new Ajv().addMetaSchema(
  require('ajv/lib/refs/json-schema-draft-06.json'),
)

const validateJSON = ajv.compile(schema)

export function parseConfig(config: EmmaConfig): EmmaConfig | null {
  if (validateJSON(config)) {
    return config
  } else {
    return null
  }
}
