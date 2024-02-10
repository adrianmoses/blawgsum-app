import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag'
import {NextRequest} from "next/server";


const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World'
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler =  startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async req  => ({ req })
});

export { handler as GET, handler as POST };
