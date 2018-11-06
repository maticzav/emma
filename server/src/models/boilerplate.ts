import { Schema, model } from 'mongoose'

export interface Boilerplate {
  name: string
  description: string
  path: string
  repository: {
    owner: string
    name: string
    branch: string
  }
  installation: {
    id: string
  }
  github: {
    issue?: number
    pr?: number
  }
  public: boolean
}

const boilerplateSchema = new Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String, unique: true, required: true },
  path: { type: String, unique: false, required: true },
  repository: {
    owner: { type: String, unique: false, required: true },
    name: { type: String, unique: false, required: true },
    branch: { type: String, unique: true, required: true },
  },
  installation: {
    id: { type: String, unique: false, required: true },
  },
  github: {
    issue: { type: Number, unique: false, require: false },
    pr: { type: Number, unique: false, require: false },
  },
  public: { type: Boolean, required: true, default: false },
})

export const Boilerplate = model('Boilerplate', boilerplateSchema)
