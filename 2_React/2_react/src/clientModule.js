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


function getAuthContext() {

  const token = localStorage.getItem("token");

  return {
    context: {
      headers: {
        authorization:
          token ? `Bearer ${token}` : ""
      }
    }
  };
}


// LOGIN

export const login = async (
  username,
  password
) => {

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

  const auth = getAuthContext();

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
    },

    ...auth

  });

  return result.data.createOrder;
};


// CUSTOMER ORDERS

export const getMyOrders = async () => {

  const auth = getAuthContext();

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

    ...auth

  });

  return result.data.myOrders;
};


export default client;