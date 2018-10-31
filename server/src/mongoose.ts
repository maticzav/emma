import { Schema, Types, model, connect, connection } from 'mongoose'

// Config

if (!process.env.MONGOOSE_URI) {
  throw new Error(`Missing configuration MONGOOSE_URI.`)
}

connect(process.env.MONGOOSE_URI)

connection.once('open', () => {
  console.log(`Connected to MongoDB`)
})

connection.on('error', err => {
  console.error(`Error with MongoDB:`, err)
})

// Schema

const boilerplateSchema = new Schema({
  id: { type: Types.ObjectId, unique: true, auto: true },
  name: { type: String, unique: true },
  description: { type: String, unique: true },
  repository: {
    uri: { type: String, unique: false },
    branch: { type: String, unique: true },
    path: { type: String, unique: false },
  },
  // analytics: {
  //   downloads: { type: Number },
  // },
})

export const Boilerplate = model('Boilerplate', boilerplateSchema)
