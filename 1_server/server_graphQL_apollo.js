// File: server_graphQL_apollo.js

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';

import * as productDB from './productModule.js';
import * as authDB from './authModule.js';
import * as orderDB from './orderModule.js';


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

  type OrderItem {
    product: Product
    quantity: Int
    price: Float
  }

  type Order {
    _id: String
    customer: User
    items: [OrderItem]
    total: Float
    createdAt: String
  }   

  input OrderItemInput {
    productId: String!
    quantity: Int!
  }

  input OrderItemInput {
    productId: String!
    quantity: Int!
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

    myOrders: [Order]!

    customers: [User]!

    customerOrders(
        customerId: String!
    ): [Order]!
  }


  type Mutation {

    login(
        username: String!,
        password: String!
    ): AuthPayload

    createOrder(
        items: [OrderItemInput!]!
    ): Order

    updateOrder(
       id: String!,
      items: [OrderItemInput!]!
    ): Order

    addProduct(
        id: String!,
        name: String!,
        description: String!,
        price: Float!,
        quantity: Int!
    ): Product

    updateProduct(
        id: String!,
        name: String,
        description: String,
        price: Float,
        quantity: Int
    ): Product

    deleteProduct(
        id: String!
    ): Boolean


    deleteOrder(
        id: String!
    ): Boolean
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
    },

    myOrders: async (parent, args, context) => {

        const user = authDB.requireUser(context);

        return await orderDB.getCustomerOrders(
            user.id
        );
    },


    customers: async (parent, args, context) => {

        authDB.requireAdmin(context);

        return await orderDB.getCustomers();
    },


    customerOrders: async (parent, args, context) => {

        authDB.requireAdmin(context);

        return await orderDB.getOrdersByCustomer(
        args.customerId
        );
    }

  },


  Mutation: {

    login: async (parent, args) => {

      console.log("Login attempt:", args.username);

      return await authDB.login(
        args.username,
        args.password
      );
    },

    createOrder: async (parent, args, context) => {

        const user = authDB.requireUser(context);

        if (user.role !== "customer") {
            throw new Error(
            "Only customers can place orders"
            );
        }

        return await orderDB.createOrder(
            user.id,
            args.items
        );
    },


        addProduct: async (parent, args, context) => {

        authDB.requireAdmin(context);

        return await productDB.addProduct(
            args.id,
            args.name,
            args.description,
            args.price,
            args.quantity
        );
    },


        updateProduct: async (parent, args, context) => {

        authDB.requireAdmin(context);

        return await productDB.updateProduct(
            args.id,
            args.name,
            args.description,
            args.price,
            args.quantity
        );
    },


        deleteProduct: async (parent, args, context) => {

        authDB.requireAdmin(context);

        return await productDB.deleteProduct(
            args.id
        );
    },


        deleteOrder: async (parent, args, context) => {

        authDB.requireAdmin(context);

        return await orderDB.deleteOrder(
            args.id
        );
    },

        updateOrder: async (parent, args, context) => {

        authDB.requireAdmin(context);

        return await orderDB.updateOrder(
          args.id,
          args.items
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