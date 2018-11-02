import { connect, connection } from 'mongoose'

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
