export const typeDefs = /* GraphQL */ `type AggregateBoilerplate {
  count: Int!
}

type AggregateInstallation {
  count: Int!
}

type AggregateRepository {
  count: Int!
}

type BatchPayload {
  count: Long!
}

type Boilerplate {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  name: String!
  description: String!
  path: String!
  repository: Repository!
}

type BoilerplateConnection {
  pageInfo: PageInfo!
  edges: [BoilerplateEdge]!
  aggregate: AggregateBoilerplate!
}

input BoilerplateCreateInput {
  name: String!
  description: String!
  path: String!
  repository: RepositoryCreateOneWithoutBoilerplatesInput!
}

input BoilerplateCreateManyWithoutRepositoryInput {
  create: [BoilerplateCreateWithoutRepositoryInput!]
  connect: [BoilerplateWhereUniqueInput!]
}

input BoilerplateCreateWithoutRepositoryInput {
  name: String!
  description: String!
  path: String!
}

type BoilerplateEdge {
  node: Boilerplate!
  cursor: String!
}

enum BoilerplateOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
  description_ASC
  description_DESC
  path_ASC
  path_DESC
}

type BoilerplatePreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  name: String!
  description: String!
  path: String!
}

type BoilerplateSubscriptionPayload {
  mutation: MutationType!
  node: Boilerplate
  updatedFields: [String!]
  previousValues: BoilerplatePreviousValues
}

input BoilerplateSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: BoilerplateWhereInput
  AND: [BoilerplateSubscriptionWhereInput!]
  OR: [BoilerplateSubscriptionWhereInput!]
  NOT: [BoilerplateSubscriptionWhereInput!]
}

input BoilerplateUpdateInput {
  name: String
  description: String
  path: String
  repository: RepositoryUpdateOneRequiredWithoutBoilerplatesInput
}

input BoilerplateUpdateManyMutationInput {
  name: String
  description: String
  path: String
}

input BoilerplateUpdateManyWithoutRepositoryInput {
  create: [BoilerplateCreateWithoutRepositoryInput!]
  delete: [BoilerplateWhereUniqueInput!]
  connect: [BoilerplateWhereUniqueInput!]
  disconnect: [BoilerplateWhereUniqueInput!]
  update: [BoilerplateUpdateWithWhereUniqueWithoutRepositoryInput!]
  upsert: [BoilerplateUpsertWithWhereUniqueWithoutRepositoryInput!]
}

input BoilerplateUpdateWithoutRepositoryDataInput {
  name: String
  description: String
  path: String
}

input BoilerplateUpdateWithWhereUniqueWithoutRepositoryInput {
  where: BoilerplateWhereUniqueInput!
  data: BoilerplateUpdateWithoutRepositoryDataInput!
}

input BoilerplateUpsertWithWhereUniqueWithoutRepositoryInput {
  where: BoilerplateWhereUniqueInput!
  update: BoilerplateUpdateWithoutRepositoryDataInput!
  create: BoilerplateCreateWithoutRepositoryInput!
}

input BoilerplateWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  path: String
  path_not: String
  path_in: [String!]
  path_not_in: [String!]
  path_lt: String
  path_lte: String
  path_gt: String
  path_gte: String
  path_contains: String
  path_not_contains: String
  path_starts_with: String
  path_not_starts_with: String
  path_ends_with: String
  path_not_ends_with: String
  repository: RepositoryWhereInput
  AND: [BoilerplateWhereInput!]
  OR: [BoilerplateWhereInput!]
  NOT: [BoilerplateWhereInput!]
}

input BoilerplateWhereUniqueInput {
  id: ID
  name: String
}

scalar DateTime

type Installation {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  githubId: String!
  repositories(where: RepositoryWhereInput, orderBy: RepositoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Repository!]
}

type InstallationConnection {
  pageInfo: PageInfo!
  edges: [InstallationEdge]!
  aggregate: AggregateInstallation!
}

input InstallationCreateInput {
  githubId: String!
  repositories: RepositoryCreateManyWithoutInstallationInput
}

input InstallationCreateOneWithoutRepositoriesInput {
  create: InstallationCreateWithoutRepositoriesInput
  connect: InstallationWhereUniqueInput
}

input InstallationCreateWithoutRepositoriesInput {
  githubId: String!
}

type InstallationEdge {
  node: Installation!
  cursor: String!
}

enum InstallationOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  githubId_ASC
  githubId_DESC
}

type InstallationPreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  githubId: String!
}

type InstallationSubscriptionPayload {
  mutation: MutationType!
  node: Installation
  updatedFields: [String!]
  previousValues: InstallationPreviousValues
}

input InstallationSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: InstallationWhereInput
  AND: [InstallationSubscriptionWhereInput!]
  OR: [InstallationSubscriptionWhereInput!]
  NOT: [InstallationSubscriptionWhereInput!]
}

input InstallationUpdateInput {
  githubId: String
  repositories: RepositoryUpdateManyWithoutInstallationInput
}

input InstallationUpdateManyMutationInput {
  githubId: String
}

input InstallationUpdateOneRequiredWithoutRepositoriesInput {
  create: InstallationCreateWithoutRepositoriesInput
  update: InstallationUpdateWithoutRepositoriesDataInput
  upsert: InstallationUpsertWithoutRepositoriesInput
  connect: InstallationWhereUniqueInput
}

input InstallationUpdateWithoutRepositoriesDataInput {
  githubId: String
}

input InstallationUpsertWithoutRepositoriesInput {
  update: InstallationUpdateWithoutRepositoriesDataInput!
  create: InstallationCreateWithoutRepositoriesInput!
}

input InstallationWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  githubId: String
  githubId_not: String
  githubId_in: [String!]
  githubId_not_in: [String!]
  githubId_lt: String
  githubId_lte: String
  githubId_gt: String
  githubId_gte: String
  githubId_contains: String
  githubId_not_contains: String
  githubId_starts_with: String
  githubId_not_starts_with: String
  githubId_ends_with: String
  githubId_not_ends_with: String
  repositories_every: RepositoryWhereInput
  repositories_some: RepositoryWhereInput
  repositories_none: RepositoryWhereInput
  AND: [InstallationWhereInput!]
  OR: [InstallationWhereInput!]
  NOT: [InstallationWhereInput!]
}

input InstallationWhereUniqueInput {
  id: ID
  githubId: String
}

scalar Long

type Mutation {
  createBoilerplate(data: BoilerplateCreateInput!): Boilerplate!
  updateBoilerplate(data: BoilerplateUpdateInput!, where: BoilerplateWhereUniqueInput!): Boilerplate
  updateManyBoilerplates(data: BoilerplateUpdateManyMutationInput!, where: BoilerplateWhereInput): BatchPayload!
  upsertBoilerplate(where: BoilerplateWhereUniqueInput!, create: BoilerplateCreateInput!, update: BoilerplateUpdateInput!): Boilerplate!
  deleteBoilerplate(where: BoilerplateWhereUniqueInput!): Boilerplate
  deleteManyBoilerplates(where: BoilerplateWhereInput): BatchPayload!
  createInstallation(data: InstallationCreateInput!): Installation!
  updateInstallation(data: InstallationUpdateInput!, where: InstallationWhereUniqueInput!): Installation
  updateManyInstallations(data: InstallationUpdateManyMutationInput!, where: InstallationWhereInput): BatchPayload!
  upsertInstallation(where: InstallationWhereUniqueInput!, create: InstallationCreateInput!, update: InstallationUpdateInput!): Installation!
  deleteInstallation(where: InstallationWhereUniqueInput!): Installation
  deleteManyInstallations(where: InstallationWhereInput): BatchPayload!
  createRepository(data: RepositoryCreateInput!): Repository!
  updateRepository(data: RepositoryUpdateInput!, where: RepositoryWhereUniqueInput!): Repository
  updateManyRepositories(data: RepositoryUpdateManyMutationInput!, where: RepositoryWhereInput): BatchPayload!
  upsertRepository(where: RepositoryWhereUniqueInput!, create: RepositoryCreateInput!, update: RepositoryUpdateInput!): Repository!
  deleteRepository(where: RepositoryWhereUniqueInput!): Repository
  deleteManyRepositories(where: RepositoryWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  boilerplate(where: BoilerplateWhereUniqueInput!): Boilerplate
  boilerplates(where: BoilerplateWhereInput, orderBy: BoilerplateOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Boilerplate]!
  boilerplatesConnection(where: BoilerplateWhereInput, orderBy: BoilerplateOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): BoilerplateConnection!
  installation(where: InstallationWhereUniqueInput!): Installation
  installations(where: InstallationWhereInput, orderBy: InstallationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Installation]!
  installationsConnection(where: InstallationWhereInput, orderBy: InstallationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): InstallationConnection!
  repository(where: RepositoryWhereUniqueInput!): Repository
  repositories(where: RepositoryWhereInput, orderBy: RepositoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Repository]!
  repositoriesConnection(where: RepositoryWhereInput, orderBy: RepositoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): RepositoryConnection!
  node(id: ID!): Node
}

type Repository {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  githubId: String!
  name: String!
  owner: String!
  boilerplates(where: BoilerplateWhereInput, orderBy: BoilerplateOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Boilerplate!]
  installation: Installation!
}

type RepositoryConnection {
  pageInfo: PageInfo!
  edges: [RepositoryEdge]!
  aggregate: AggregateRepository!
}

input RepositoryCreateInput {
  githubId: String!
  name: String!
  owner: String!
  boilerplates: BoilerplateCreateManyWithoutRepositoryInput
  installation: InstallationCreateOneWithoutRepositoriesInput!
}

input RepositoryCreateManyWithoutInstallationInput {
  create: [RepositoryCreateWithoutInstallationInput!]
  connect: [RepositoryWhereUniqueInput!]
}

input RepositoryCreateOneWithoutBoilerplatesInput {
  create: RepositoryCreateWithoutBoilerplatesInput
  connect: RepositoryWhereUniqueInput
}

input RepositoryCreateWithoutBoilerplatesInput {
  githubId: String!
  name: String!
  owner: String!
  installation: InstallationCreateOneWithoutRepositoriesInput!
}

input RepositoryCreateWithoutInstallationInput {
  githubId: String!
  name: String!
  owner: String!
  boilerplates: BoilerplateCreateManyWithoutRepositoryInput
}

type RepositoryEdge {
  node: Repository!
  cursor: String!
}

enum RepositoryOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  githubId_ASC
  githubId_DESC
  name_ASC
  name_DESC
  owner_ASC
  owner_DESC
}

type RepositoryPreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  githubId: String!
  name: String!
  owner: String!
}

type RepositorySubscriptionPayload {
  mutation: MutationType!
  node: Repository
  updatedFields: [String!]
  previousValues: RepositoryPreviousValues
}

input RepositorySubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: RepositoryWhereInput
  AND: [RepositorySubscriptionWhereInput!]
  OR: [RepositorySubscriptionWhereInput!]
  NOT: [RepositorySubscriptionWhereInput!]
}

input RepositoryUpdateInput {
  githubId: String
  name: String
  owner: String
  boilerplates: BoilerplateUpdateManyWithoutRepositoryInput
  installation: InstallationUpdateOneRequiredWithoutRepositoriesInput
}

input RepositoryUpdateManyMutationInput {
  githubId: String
  name: String
  owner: String
}

input RepositoryUpdateManyWithoutInstallationInput {
  create: [RepositoryCreateWithoutInstallationInput!]
  delete: [RepositoryWhereUniqueInput!]
  connect: [RepositoryWhereUniqueInput!]
  disconnect: [RepositoryWhereUniqueInput!]
  update: [RepositoryUpdateWithWhereUniqueWithoutInstallationInput!]
  upsert: [RepositoryUpsertWithWhereUniqueWithoutInstallationInput!]
}

input RepositoryUpdateOneRequiredWithoutBoilerplatesInput {
  create: RepositoryCreateWithoutBoilerplatesInput
  update: RepositoryUpdateWithoutBoilerplatesDataInput
  upsert: RepositoryUpsertWithoutBoilerplatesInput
  connect: RepositoryWhereUniqueInput
}

input RepositoryUpdateWithoutBoilerplatesDataInput {
  githubId: String
  name: String
  owner: String
  installation: InstallationUpdateOneRequiredWithoutRepositoriesInput
}

input RepositoryUpdateWithoutInstallationDataInput {
  githubId: String
  name: String
  owner: String
  boilerplates: BoilerplateUpdateManyWithoutRepositoryInput
}

input RepositoryUpdateWithWhereUniqueWithoutInstallationInput {
  where: RepositoryWhereUniqueInput!
  data: RepositoryUpdateWithoutInstallationDataInput!
}

input RepositoryUpsertWithoutBoilerplatesInput {
  update: RepositoryUpdateWithoutBoilerplatesDataInput!
  create: RepositoryCreateWithoutBoilerplatesInput!
}

input RepositoryUpsertWithWhereUniqueWithoutInstallationInput {
  where: RepositoryWhereUniqueInput!
  update: RepositoryUpdateWithoutInstallationDataInput!
  create: RepositoryCreateWithoutInstallationInput!
}

input RepositoryWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  githubId: String
  githubId_not: String
  githubId_in: [String!]
  githubId_not_in: [String!]
  githubId_lt: String
  githubId_lte: String
  githubId_gt: String
  githubId_gte: String
  githubId_contains: String
  githubId_not_contains: String
  githubId_starts_with: String
  githubId_not_starts_with: String
  githubId_ends_with: String
  githubId_not_ends_with: String
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  owner: String
  owner_not: String
  owner_in: [String!]
  owner_not_in: [String!]
  owner_lt: String
  owner_lte: String
  owner_gt: String
  owner_gte: String
  owner_contains: String
  owner_not_contains: String
  owner_starts_with: String
  owner_not_starts_with: String
  owner_ends_with: String
  owner_not_ends_with: String
  boilerplates_every: BoilerplateWhereInput
  boilerplates_some: BoilerplateWhereInput
  boilerplates_none: BoilerplateWhereInput
  installation: InstallationWhereInput
  AND: [RepositoryWhereInput!]
  OR: [RepositoryWhereInput!]
  NOT: [RepositoryWhereInput!]
}

input RepositoryWhereUniqueInput {
  id: ID
  githubId: String
}

type Subscription {
  boilerplate(where: BoilerplateSubscriptionWhereInput): BoilerplateSubscriptionPayload
  installation(where: InstallationSubscriptionWhereInput): InstallationSubscriptionPayload
  repository(where: RepositorySubscriptionWhereInput): RepositorySubscriptionPayload
}
`
