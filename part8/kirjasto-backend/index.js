const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const http = require('http')

require('dotenv').config()

const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.SECRET

const mongoose = require('mongoose')

const User = require('./models/user')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const MONGODB_URI = process.env.MONGODB_URI

// Yhdistetään MongoDB-tietokantaan.
console.log('Connecting to:', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB.')
  })
  .catch((error) => {
    console.log(
      'An error occurred while trying to connect to MongoDB:',
      error.message
    )
  })

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
  
      // Tarkistetaan, saatiinko pyynnön mukana Tokenia.
      const authorization = req
        ? req.headers.authorization
        : null
  
      // Jos Token vastaanotettiin ja sen alku
      // on oikeaa muotoa, varmistetaan sen kelvollisuus.
      if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(
          authorization.substring(7), JWT_SECRET
        )
        
        // Haetaan tietokannasta Tokenin tunnistetta vastaava
        // käyttäjä ja määritetään se contextin currentUser -kenttään.
        const currentUser = await User.findById(decodedToken.id)
  
        return { currentUser }
      }
    },
    plugins: [ ApolloServerPluginDrainHttpServer({ httpServer }) ]
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/',
  })

  const PORT = process.env.PORT

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

// Käynnistetään palvelin.
start()
