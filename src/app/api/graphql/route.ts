import { gql } from 'graphql-tag'
import { createSchema, createYoga } from 'graphql-yoga'
import prisma from '@/server/db'

const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs: gql`
      type User {
        id: ID!
        username: String!
        email: String!
        posts: [Post!]!
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
        postsByUser: async (parent, { userId }) => {
          return prisma.post.findMany({
            where: {
              authorId: userId
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


