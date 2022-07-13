import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache
} from '@apollo/client'

import { setContext } from 'apollo-link-context'

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

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

// Olio GraphQL-palvelimen kanssa kommunikointia varten.
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})

// Client-olio kaikkien komponenttien saataville
// käärimällä <App> <ApolloProvider>:in sisälle.
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
document.getElementById('root'))
