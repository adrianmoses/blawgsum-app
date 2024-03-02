import { gql } from 'graphql-tag'
import { createSchema, createYoga } from 'graphql-yoga'
import prisma from '@/server/db'
import type { Post as PrismaPost } from '@prisma/client'
import argon2 from 'argon2'
import {timeAgo} from "@/src/app/utils/time-ago";

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

interface Post extends PrismaPost {
  publishedSince?: string
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
        name: String
        email: String!
        image: String
      }
      
      type Post {
        id: ID!
        title: String!
        slug: String!
        body: String!
        author: User!
        coverImage: String
        createdAt: String!
        publishedAt: String
        publishedSince: String
        isPublished: Boolean!
      }
      
      type Query {
        postByProjectAndSlug(projectId: ID!, slug: String!): Post
        postsByProject(projectId: ID!): [Post!]!
        publishedPostsByProject(projectId: ID!): [Post!]!
        postLatestByProject(projectId: ID!): Post
      }
    `,
    resolvers: {
      Query: {
        postByProjectAndSlug: async (_, { projectId, slug }, context) => {
          const { apiKey } = context

          const isValidRequest = await validateApiKey(apiKey, projectId)

          if (!isValidRequest) {
            throw new Error('Unauthorized')
          }

          const post: Post | null = await prisma.post.findFirst({
            where: {
              slug,
              projectId,
            },
            include: {
              author: true
            }
          })

          if (post && post.publishedAt) {
            post.publishedSince = timeAgo(post.publishedAt)
          }

          return post

        },
        postsByProject: async (_, { projectId }, context) => {
          const { apiKey } = context

          const isValidRequest = await validateApiKey(apiKey, projectId)

          if (!isValidRequest) {
            throw new Error('Unauthorized')
          }

          const posts: Post[]  = await prisma.post.findMany({
            where: {
              projectId
            },
            include: {
              author: true
            }
          })

          return posts.map((post) => {
            if (post.publishedAt) {
              post.publishedSince = timeAgo(post.publishedAt)
            }
            return post
          })
        },
        publishedPostsByProject: async (_, { projectId }, context) => {
            const { apiKey } = context

            const isValidRequest = await validateApiKey(apiKey, projectId)

            if (!isValidRequest) {
                throw new Error('Unauthorized')
            }

            const posts: Post[] =  await prisma.post.findMany({
              where: {
                projectId,
                isPublished: true
              },
              include: {
                author: true
              },
              orderBy: {
                publishedAt: 'desc'
              }
            })

            return posts.map((post) => {
              if (post.publishedAt) {
                post.publishedSince = timeAgo(post.publishedAt)
              }
              return post
            })
        },
        postLatestByProject: async (_, { projectId }, context) => {
          const {apiKey} = context

          const isValidRequest = await validateApiKey(apiKey, projectId)

          if (!isValidRequest) {
            throw new Error('Unauthorized')
          }

          const post: Post | null = await prisma.post.findFirst({
            where: {
              projectId,
              isPublished: true
            },
            include: {
              author: true
            },
            orderBy: {
              publishedAt: 'desc'
            }
          })

          if (post && post.publishedAt) {
            post.publishedSince = timeAgo(post.publishedAt)
          }

          return post
        }
      }
    }
  }),

  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: '/api/graphql',

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response }
})

export { handleRequest as GET, handleRequest as POST}


