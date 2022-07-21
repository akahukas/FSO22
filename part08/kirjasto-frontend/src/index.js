import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache,
  split
} from '@apollo/client'

import { setContext } from 'apollo-link-context'

import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

// Lisätään headereiden authorization-kenttään Token.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('libraryUserToken')

  return {
    headers: {
      ...headers,
      authorization: token
        ? `bearer ${token}`
        : null
    }
  }
})

// HTTP-yhteys palvelimelle.
const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

// Websocket-yhteys palvelimelle.
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink),
)

// Olio GraphQL-palvelimen kanssa kommunikointia varten.
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

// Client-olio kaikkien komponenttien saataville
// käärimällä <App> <ApolloProvider>:in sisälle.
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
document.getElementById('root'))
