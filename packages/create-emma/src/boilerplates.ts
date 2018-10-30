export interface Boilerplate {
  name: string
  description: string
  repo: BoilerplateRepository
}

export interface BoilerplateRepository {
  uri: string
  branch: string
  path: string
}

export const defaultBoilerplate: Boilerplate = {
  name: 'airport',
  description: 'GraphQL Airport Boilerplate',
  repo: {
    uri: 'https://github.com/maticzav/graphql-airport',
    branch: 'master',
    path: '/packages/graphql-airport-starter',
  },
}
