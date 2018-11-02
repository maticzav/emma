import { Schema, Types, model } from 'mongoose'

const boilerplateSchema = new Schema({
  id: { type: Types.ObjectId, unique: true, auto: true, required: true },
  name: { type: String, unique: true, required: true },
  description: { type: String, unique: true, required: true },
  repository: {
    uri: { type: String, unique: false, required: true },
    branch: { type: String, unique: true, required: true },
    path: { type: String, unique: false, required: true },
  },
  installation: {
    id: { type: String, unique: false, required: true },
  },
  // analytics: {
  //   downloads: { type: Number },
  // },
})

export const Boilerplate = model('Boilerplate', boilerplateSchema)
