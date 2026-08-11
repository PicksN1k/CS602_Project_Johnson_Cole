// File: clientModule.js

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';


// GraphQL server connection
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/'
});


// Automatically attach JWT token to every request
const authLink = setContext((_, { headers }) => {

  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token
        ? `Bearer ${token}`
        : ""
    }
  };

});


const client = new ApolloClient({

  link: authLink.concat(httpLink),

  cache: new InMemoryCache(),

  defaultOptions: {

    query: {
      fetchPolicy: 'network-only'
    },

    watchQuery: {
      fetchPolicy: 'network-only'
    }

  }

});


// LOGIN

export const login = async (username, password) => {

  const result = await client.mutate({

    mutation: gql`
      mutation Login(
        $username: String!,
        $password: String!
      ) {

        login(
          username: $username,
          password: $password
        ) {

          token

          user {
            id
            username
            role
          }

        }
      }
    `,

    variables: {
      username,
      password
    }

  });

  return result.data.login;
};


// GET PRODUCTS

export const getProducts = async () => {

  const result = await client.query({

    query: gql`
      query {
        products {
          _id
          name
          description
          price
          quantity
        }
      }
    `

  });

  return result.data.products;
};


// CREATE ORDER

export const createOrder = async (items) => {

  const result = await client.mutate({

    mutation: gql`
      mutation CreateOrder(
        $items: [OrderItemInput!]!
      ) {

        createOrder(items: $items) {
          _id
          total
        }

      }
    `,

    variables: {
      items
    }

  });

  return result.data.createOrder;
};


// CUSTOMER ORDERS

export const getMyOrders = async () => {

  const result = await client.query({

    query: gql`
      query {

        myOrders {

          _id
          total
          createdAt

          items {

            product {
              _id
              name
            }

            quantity
            price

          }

        }

      }
    `

  });

  return result.data.myOrders;
};

// GET CUSTOMERS - ADMIN

export const getCustomers = async () => {

  const auth = getAuthContext();

  const result = await client.query({
    query: gql`
      query {
        customers {
          id
          username
          role
        }
      }
    `,
    ...auth
  });

  return result.data.customers;
};

// ADD PRODUCT - ADMIN

export const addProduct = async (
  id,
  name,
  description,
  price,
  quantity
) => {

  const result = await client.mutate({

    mutation: gql`
      mutation AddProduct(
        $id: String!,
        $name: String!,
        $description: String!,
        $price: Float!,
        $quantity: Int!
      ) {

        addProduct(
          id: $id,
          name: $name,
          description: $description,
          price: $price,
          quantity: $quantity
        ) {
          _id
          name
          description
          price
          quantity
        }

      }
    `,

    variables: {
      id,
      name,
      description,
      price: Number(price),
      quantity: Number(quantity)
    },

    context: authContext()

  });

  return result.data.addProduct;
};

// UPDATE PRODUCT - ADMIN

export const updateProduct = async (
  id,
  name,
  description,
  price,
  quantity
) => {

  const result = await client.mutate({

    mutation: gql`
      mutation UpdateProduct(
        $id: String!,
        $name: String,
        $description: String,
        $price: Float,
        $quantity: Int
      ) {

        updateProduct(
          id: $id,
          name: $name,
          description: $description,
          price: $price,
          quantity: $quantity
        ) {
          _id
          name
          description
          price
          quantity
        }

      }
    `,

    variables: {
      id,
      name,
      description,
      price: Number(price),
      quantity: Number(quantity)
    },

    context: authContext()

  });

  return result.data.updateProduct;
};

// DELETE PRODUCT - ADMIN

export const deleteProduct = async (id) => {

  const result = await client.mutate({

    mutation: gql`
      mutation DeleteProduct($id: String!) {

        deleteProduct(id: $id)

      }
    `,

    variables: {
      id
    },

    context: authContext()

  });

  return result.data.deleteProduct;
};

// DELETE ORDER - ADMIN

export const deleteOrder = async (id) => {

  const result = await client.mutate({

    mutation: gql`
      mutation DeleteOrder($id: String!) {

        deleteOrder(id: $id)

      }
    `,

    variables: {
      id
    },

    context: authContext()

  });

  return result.data.deleteOrder;
};

export default client;