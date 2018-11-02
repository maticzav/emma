import { Schema, Types, model } from 'mongoose'

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
})

export const Boilerplate = model('Boilerplate', boilerplateSchema)
