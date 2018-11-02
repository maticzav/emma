import { Schema, Types, model } from 'mongoose'

const installationSchema = new Schema({
  id: { type: Types.ObjectId, unique: true, required: true },
  repositories: [{ type: Schema.Types.ObjectId, ref: 'Repository' }],
})

export const Installation = model('Installation', installationSchema)
