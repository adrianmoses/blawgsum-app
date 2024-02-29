import { gql } from 'graphql-tag'
import { createSchema, createYoga } from 'graphql-yoga'
import prisma from '@/server/db'
import argon2 from 'argon2'

const validateApiKey = async (apiKey: string | null, projectId: string) => {
  if (!apiKey) {
    return false
  }

  const prefix= apiKey.split('.')[0]
  const projectApiKey = await prisma.apiKey.findFirst({
    where: {
      projectId,
      keyPrefix: prefix
    }
  })

  if (projectApiKey) {
    console.log(projectApiKey.apiKey, apiKey)
    return await argon2.verify(projectApiKey.apiKey, apiKey)
  } else {
    return false
  }
}

const { handleRequest } = createYoga({
  context: async ({ request }) => {
    const apiKey = request.headers.get('x-api-key') ?? null
    return { apiKey }
  },
  schema: createSchema({
    typeDefs: gql`
      type User {
        id: ID!
        email: String!
      }
      
      type Post {
        id: ID!
        title: String!
        slug: String!
        body: String!
        author: User!
        createdAt: String!
        publishedAt: String
        isPublished: Boolean!
      }
      
      type Query {
        postByProjectAndSlug(projectId: ID!, slug: String!): Post
        postsByProject(projectId: ID!): [Post!]!
      }
    `,
    resolvers: {
      Query: {
        postByProjectAndSlug: async (_, { projectId, slug }, context) => {
          const { apiKey } = context

          console.log(apiKey, projectId)
          const isValidRequest = await validateApiKey(apiKey, projectId)

          if (!isValidRequest) {
            throw new Error('Unauthorized')
          }

          return prisma.post.findFirst({
            where: {
              slug,
              projectId,
            },
            include: {
              author: true
            }
          })

        },
        postsByProject: async (_, { projectId }, context) => {
          const { apiKey } = context

          console.log(apiKey, projectId)
          const isValidRequest = await validateApiKey(apiKey, projectId)

          if (!isValidRequest) {
            throw new Error('Unauthorized')
          }

          return prisma.post.findMany({
            where: {
              projectId
            },
            include: {
              author: true
            }
          })
        },
      }
    }
  }),

  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: `${process.env.HOST_URL}/api/graphql`,

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response }
})

export { handleRequest as GET, handleRequest as POST}


