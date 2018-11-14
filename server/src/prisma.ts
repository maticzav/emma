import { Prisma } from './generated/'

if (!process.env.PRISMA_ENDPOINT || !process.env.PRISMA_SECRET) {
  throw new Error(`Missing Prisma configuration.`)
}

export default new Prisma({
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
})
