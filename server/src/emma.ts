import { EmmaConfig } from 'emma-json-schema'

export function parseConfiguration(config: EmmaConfig): string {
  return JSON.stringify(config)
}
