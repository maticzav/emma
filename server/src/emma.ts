import { Context } from 'probot'
import { EmmaConfig } from 'emma-json-schema'
import { emmaConfigNames } from '../config'

function changedEmmaConfiguration(context: Context): boolean {
  const { commits } = context.payload

  commits.some()

  return true

  // Functions which help with the execution of this algorithm.

  function hasEmmaConfigInChangedFiles(files: string[]) {
    return files.some(file => emmaConfigNames.includes(file))
  }
}

async function getEmmaConfiguration(context: Context): Promise<EmmaConfig> {
  const file = await context.github.issues.create

  return
}

async function createEmmaConfigSetupPR(context: Context): Promise<void> {
  const body = `
    
  `
}
