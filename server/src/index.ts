import { ApolloServer, gql } from 'apollo-server'
import { Prisma } from './generated/index'

const typeDefs = gql`
  type Boilerplate {
    id: ID! @unique
    createdAt: DateTime!
    updatedAt: DateTime!

    name: String! @unique
    description: String!
    path: String!

    repository: Repository!
  }

  type Repository {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    name: String!
    owner: String!

    boilerplates: [Boilerplate!]!
  }
`

const resolvers = {}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    db: new Prisma({
      endpoint: process.env.PRISMA_ENDPOINT!,
      secret: process.env.PRISMA_SECRET!,
    }),
  }),
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
