import { Schema, Types, model } from 'mongoose'

const repositorySchema = new Schema({
  id: { type: Types.ObjectId, unique: true, auto: true, required: true },
  owner: { type: String, unique: false, required: true },
  name: { type: String, unique: false, required: true },
  installation: { type: Types.ObjectId, ref: 'Installation' },
  boilerplates: [{ type: Schema.Types.ObjectId, ref: 'Repository' }],
})

export const Repository = model('Repository', repositorySchema)
