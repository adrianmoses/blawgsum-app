import { gql } from 'graphql-tag'
import { createSchema, createYoga } from 'graphql-yoga'
import prisma from '@/server/db'
import argon2 from 'argon2'

const validateApiKey = async (apiKey: string | null, userId: string) => {
  if (!apiKey) {
    return false
  }

  const prefix= apiKey.split('.')[0]
  const userApiKey = await prisma.userApiKey.findFirst({
    where: {
      userId,
      keyPrefix: prefix
    }
  })

  if (userApiKey) {
    console.log(userApiKey.apiKey, apiKey)
    return await argon2.verify(userApiKey.apiKey, apiKey)
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
        postsByUser(userId: ID!): [Post!]!
        postBySlug(slug: String!): Post
      }
    `,
    resolvers: {
      Query: {
        postsByUser: async (_, { userId }, context) => {
          const { apiKey } = context

          console.log(apiKey, userId)
          const isValidRequest = await validateApiKey(apiKey, userId)

          if (!isValidRequest) {
            throw new Error('Unauthorized')
          }

          return prisma.post.findMany({
            where: {
              authorId: userId
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
  graphqlEndpoint: '/api/graphql',

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response }
})

export { handleRequest as GET, handleRequest as POST}


