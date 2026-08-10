// File: server_graphQL_apollo.js

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';

import * as productDB from './productModule.js';

const mongoURL = 'mongodb://127.0.0.1:27017/cs602_project';

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

  type Query {

    products: [Product]!

    productNameLookup(
      name: String!
    ): [Product]!

    productsByPrice(
      min: Float!,
      max: Float!
    ): [Product]!

  }

`;


const resolvers = {

  Query: {

    products: async () => {

      console.log("GraphQL: Get all products");

      const result =
        await productDB.getAllProducts();

      return result;
    },


    productNameLookup: async (parent, args) => {

      console.log(
        "GraphQL: Product name lookup",
        args.name
      );

      const result =
        await productDB.lookupByName(args.name);

      return result;
    },


    productsByPrice: async (parent, args) => {

      console.log(
        "GraphQL: Product price lookup",
        args.min,
        args.max
      );

      const result =
        await productDB.lookupByPrice(
          args.min,
          args.max
        );

      return result;
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
    }
  }
);


console.log(
  `GraphQL Server ready at: ${url}`
);