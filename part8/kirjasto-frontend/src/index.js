import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache
} from '@apollo/client'

// Olio GraphQL-palvelimen kanssa kommunikointia varten.
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
})

// Client-olio kaikkien komponenttien saataville
// käärimällä <App> <ApolloProvider>:in sisälle.
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
document.getElementById('root'))
