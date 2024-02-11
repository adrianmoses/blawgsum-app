import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag'
import {NextRequest} from "next/server";
import {
  ApolloServerPluginInlineTrace,
} from "@apollo/server/plugin/inlineTrace";

import {
  ApolloServerPluginLandingPageLocalDefault,
} from "@apollo/server/plugin/landingPage/default";

import prisma from "@/server/db"


const typeDefs = gql`
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
    hello: String
    postsByUser(userId: ID!): [Post!]!
    postBySlug(slug: String!): Post
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    postsByUser: async (_: any, { userId }: { userId: string }) => {
      return prisma.post.findMany({
        where: {
          authorId: userId
        }
      })
    }
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault(),
    ApolloServerPluginInlineTrace(),
  ],
});

const handler =  startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async req  => ({ req })
});

export { handler as GET, handler as POST}


