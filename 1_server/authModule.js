// File: clientModule.js

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql
} from '@apollo/client';


const client = new ApolloClient({

  link: new HttpLink({
    uri: 'http://localhost:4000/'
  }),

  cache: new InMemoryCache(),

  defaultOptions: {
    query: {
      fetchPolicy: 'network-only'
    }
  }

});


// Get authorization header
function authContext() {

  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: token
        ? `Bearer ${token}`
        : ""
    }
  };

}


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
    },

    context: authContext()

  });

  return result.data.createOrder;
};


// GET CUSTOMER ORDERS

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
    `,

    context: authContext(),

    fetchPolicy: 'network-only'

  });

  return result.data.myOrders;
};


export default client;