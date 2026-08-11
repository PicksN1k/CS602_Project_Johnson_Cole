// File: clientModule.js

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';


// --------------------------------------------------
// GRAPHQL SERVER CONNECTION
// --------------------------------------------------

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/'
});


// --------------------------------------------------
// AUTHENTICATION
// Automatically attach JWT token to every request
// --------------------------------------------------

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


// --------------------------------------------------
// APOLLO CLIENT
// --------------------------------------------------

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


// ==================================================
// LOGIN
// ==================================================

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


// ==================================================
// PRODUCTS
// ==================================================

// GET ALL PRODUCTS

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


// ==================================================
// CUSTOMER FUNCTIONS
// ==================================================

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
    `,

    variables: {
      items
    }

  });

  return result.data.createOrder;
};


// GET LOGGED-IN CUSTOMER ORDERS

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


// ==================================================
// ADMIN - CUSTOMERS
// ==================================================

// GET ALL CUSTOMERS

export const getCustomers = async () => {

  const result = await client.query({

    query: gql`
      query {

        customers {
          id
          username
          role
        }

      }
    `

  });

  return result.data.customers;
};


// GET ORDERS FOR A SPECIFIC CUSTOMER

export const getCustomerOrders = async (customerId) => {

  const result = await client.query({

    query: gql`
      query CustomerOrders(
        $customerId: String!
      ) {

        customerOrders(
          customerId: $customerId
        ) {

          _id
          total
          createdAt

          customer {
            id
            username
            role
          }

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
    `,

    variables: {
      customerId
    }

  });

  return result.data.customerOrders;
};


// ==================================================
// ADMIN - PRODUCT MANAGEMENT
// ==================================================

// ADD PRODUCT

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
    }

  });

  return result.data.addProduct;
};


// UPDATE PRODUCT

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
    }

  });

  return result.data.updateProduct;
};


// DELETE PRODUCT

export const deleteProduct = async (id) => {

  const result = await client.mutate({

    mutation: gql`
      mutation DeleteProduct(
        $id: String!
      ) {

        deleteProduct(
          id: $id
        )

      }
    `,

    variables: {
      id
    }

  });

  return result.data.deleteProduct;
};


// ==================================================
// ADMIN - ORDER MANAGEMENT
// ==================================================

// DELETE ORDER

export const deleteOrder = async (id) => {

  const result = await client.mutate({

    mutation: gql`
      mutation DeleteOrder(
        $id: String!
      ) {

        deleteOrder(
          id: $id
        )

      }
    `,

    variables: {
      id
    }

  });

  return result.data.deleteOrder;
};


// UPDATE ORDER

export const updateOrder = async (
  id,
  items
) => {

  const result = await client.mutate({

    mutation: gql`
      mutation UpdateOrder(
        $id: String!,
        $items: [OrderItemInput!]!
      ) {

        updateOrder(
          id: $id,
          items: $items
        ) {

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
    `,

    variables: {
      id,
      items
    }

  });

  return result.data.updateOrder;
};


export default client;