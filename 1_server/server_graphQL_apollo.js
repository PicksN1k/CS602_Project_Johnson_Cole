// File: server_graphQL_apollo.js

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';

import * as productDB from './productModule.js';
import * as authDB from './authModule.js';


const mongoURL =
  'mongodb://127.0.0.1:27017/cs602_project';

await mongoose.connect(mongoURL);

console.log("Connected to MongoDB");


const typeDefs = `#graphql

  type Product {
    _id: String
    name: String
    description: String
    price: Float
    quantity: Int
  }

  type User {
    id: String
    username: String
    role: String
  }

  type AuthPayload {
    token: String
    user: User
  }


  type Query {

    products: [Product]!

    productNameLookup(
      name: String!
    ): [Product]!

    productsByPrice(
      min: Float!,
      max: Float!
    ): [Product]!

    currentUser: User

  }


  type Mutation {

    login(
      username: String!,
      password: String!
    ): AuthPayload

  }

`;


const resolvers = {

  Query: {

    products: async () => {

      console.log("GraphQL: Get all products");

      return await productDB.getAllProducts();
    },


    productNameLookup: async (parent, args) => {

      console.log(
        "GraphQL: Product name lookup",
        args.name
      );

      return await productDB.lookupByName(
        args.name
      );
    },


    productsByPrice: async (parent, args) => {

      console.log(
        "GraphQL: Product price lookup",
        args.min,
        args.max
      );

      return await productDB.lookupByPrice(
        args.min,
        args.max
      );
    },


    currentUser: async (parent, args, context) => {

      if (!context.user) {
        return null;
      }

      return {
        id: context.user.id,
        username: context.user.username,
        role: context.user.role
      };
    }

  },


  Mutation: {

    login: async (parent, args) => {

      console.log("Login attempt:", args.username);

      return await authDB.login(
        args.username,
        args.password
      );
    }

  }

};


const server = new ApolloServer({
  typeDefs,
  resolvers
});


const { url } = await startStandaloneServer(
  server,
  {

    listen: {
      port: 4000
    },

    context: async ({ req }) => {

      const user =
        authDB.getUserFromToken(
          req.headers.authorization
        );

      return {
        user: user
      };
    }

  }
);


console.log(
  `GraphQL Server ready at: ${url}`
);