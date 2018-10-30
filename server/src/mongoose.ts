import { Schema, Types, model } from 'mongoose'

const boilerplateSchema = new Schema({
  id: { type: Types.ObjectId, unique: true, auto: true },
  name: { type: String, unique: true },
  description: { type: String, unique: true },
  repository: { type: String, unique: false },
  branch: { type: String, unique: true },
})

export const Boilerplate = model('Boilerplate', boilerplateSchema)
