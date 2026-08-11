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

    // GET ALL PRODUCTS
    products: async () => {

      console.log(
        "GraphQL: Get all products"
      );

      return await productDB.getAllProducts();
    },


    // SEARCH PRODUCTS BY NAME
    productNameLookup: async (
      parent,
      args
    ) => {

      console.log(
        "GraphQL: Product name lookup",
        args.name
      );

      return await productDB.lookupByName(
        args.name
      );
    },


    // SEARCH PRODUCTS BY PRICE
    productsByPrice: async (
      parent,
      args
    ) => {

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


    // CURRENT LOGGED IN USER
    currentUser: async (
      parent,
      args,
      context
    ) => {

      if (!context.user) {
        return null;
      }

      return {
        id: context.user.id,
        username: context.user.username,
        role: context.user.role
      };
    },


    // CUSTOMER - GET THEIR ORDERS
    myOrders: async (
      parent,
      args,
      context
    ) => {

      const user =
        authDB.requireUser(context);

      return await orderDB.getCustomerOrders(
        user.id
      );
    },


    // ADMIN - GET CUSTOMERS
    customers: async (
      parent,
      args,
      context
    ) => {

      authDB.requireAdmin(context);

      const customers =
        await orderDB.getCustomers();

      return customers.map(customer => ({
        id: customer._id.toString(),
        username: customer.username,
        role: customer.role
      }));
    },


    // ADMIN - GET ORDERS FOR CUSTOMER
    customerOrders: async (
      parent,
      args,
      context
    ) => {

      authDB.requireAdmin(context);

      return await orderDB.getOrdersByCustomer(
        args.customerId
      );
    }

  },


  Mutation: {

    // LOGIN
    login: async (
      parent,
      args
    ) => {

      console.log(
        "Login attempt:",
        args.username
      );

      return await authDB.login(
        args.username,
        args.password
      );
    },


    // CUSTOMER - CREATE ORDER
    createOrder: async (
      parent,
      args,
      context
    ) => {

      const user =
        authDB.requireUser(context);

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


    // ADMIN - ADD PRODUCT
    addProduct: async (
      parent,
      args,
      context
    ) => {

      authDB.requireAdmin(context);

      return await productDB.addProduct(
        args.id,
        args.name,
        args.description,
        args.price,
        args.quantity
      );
    },


    // ADMIN - UPDATE PRODUCT
    updateProduct: async (
      parent,
      args,
      context
    ) => {

      authDB.requireAdmin(context);

      return await productDB.updateProduct(
        args.id,
        args.name,
        args.description,
        args.price,
        args.quantity
      );
    },


    // ADMIN - DELETE PRODUCT
    deleteProduct: async (
      parent,
      args,
      context
    ) => {

      authDB.requireAdmin(context);

      return await productDB.deleteProduct(
        args.id
      );
    },


    // ADMIN - DELETE ORDER
    deleteOrder: async (
      parent,
      args,
      context
    ) => {

      authDB.requireAdmin(context);

      return await orderDB.deleteOrder(
        args.id
      );
    },


    // ADMIN - UPDATE ORDER
    updateOrder: async (
      parent,
      args,
      context
    ) => {

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

      const authHeader =
        req.headers.authorization || "";

      const user =
        authDB.getUserFromToken(
          authHeader
        );

      return {
        user
      };

    }

  }
);


console.log(
  `GraphQL Server ready at: ${url}`
);