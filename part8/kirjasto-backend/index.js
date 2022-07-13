const {
  ApolloServer,
  UserInputError,
  AuthenticationError,
  gql
} = require('apollo-server')

const mongoose = require('mongoose')
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

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

const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.SECRET

// Skeemat eli sovelluksen datan muotoilun 
// määrittely clientin ja palvelimen välillä.
const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

// Resolverit eli miten kyselyihin vastataan.
const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {

      // Haetaan tietokannasta kaikki kirjat ja
      // korvataan kirjailijan tunniste sen tiedoilla.
      const populatedBooks = await Book.find({}).populate('author')
      
      // Jos kirjailijaa ei annettu
      // parametrina, palautetaan kaikki kirjat.
      if (!args.author && !args.genre) {
        return populatedBooks
      }
      // Jos parametrina annettu vain kirjailija,
      // palautetaan kyseisen kirjailijan kirjoittamat kirjat.
      else if (!args.genre) {
        return populatedBooks.filter((book) => book.author.name === args.author)
      }
      // Jos parametrina on annettu vain genre,
      // palautetaan kyseistä genreä olevat kirjat.
      else if (!args.author) {
        return populatedBooks.filter((book) =>
          book.genres.includes(args.genre)
        )
      }
      // Jos parametrina annettu sekä kirjailija että genre,
      // palautetaan kirjat, jotka täyttävät kummankin ehdon.
      else if (args.author && args.genre) {

        // Haetaan kaikki parametrina saadun
        // kirjailijan kirjoittamat kirjat.
        const booksByCorrectAuthor = populatedBooks.filter(
          (book) => book.author.name === args.author
        )
        // Palautetaan edellä määritetyistä kirjoista vain ne,
        // jotka vastaavat parametrina saatua genreä.
        return booksByCorrectAuthor.filter((book) =>
          book.genres.includes(args.genre)
        )
      }
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      // Haetaan tietokannasta ne kirjat, joiden kirjailijan tunniste
      // vastaa parametrissa <root>-olevan kirjailijan tunnistetta.
      const suitableBooks = await Book.find({ author: { $in: [ root._id ]}})

      // Palautetaan löytyneiden kirjojen kappalemäärä.
      return suitableBooks.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {

      // Tarkistetaan onko käyttäjä kirjautuneena.
      const currentUser = context.currentUser

      // Jos kirjautunutta käyttäjää ei löydy, heitetään virhe.
      if (!currentUser) {
        throw new AuthenticationError('Unauthenticated.')
      }

      // Tarkistetaan tietokannasta, onko parametrina
      // saatua nimeä vastaava kirjailija jo olemassa.
      let authorInDatabase = await Author.findOne({ name: args.author })

      // Jos parametrina saatu kirjailija ei ole
      // tiedossa, lisätään hänet järjestelmään.
      if (!authorInDatabase) {
        
        // Luodaan kirjailijaolio; nimi annettu
        // parametreissa, syntymävuodesta ei tietoa.
        const author = new Author({
          name: args.author,
          born: null
        })
        
        // Yritetään kirjailijan tallentamista tietokantaan.
        try {
          authorInDatabase = await author.save()
        }
        // Virheen sattuessa reagoidaan virheellä.
        catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }

      // Luodaan uusi kirjaolio parametreina saaduista arvoista,
      // sekä liitetään juuri luodun kirjailijaolion tunniste kirjaolioon.
      const book = new Book({
        ...args, author: authorInDatabase._id
      })

      // Yritetään kirjan tallentamista tietokantaan.
      try {
        const returnedBook = await book.save()
        return returnedBook
      }
      // Virheen sattuessa heitetään virhe.
      catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    editAuthor: async (root, args, context) => {

      // Tarkistetaan onko käyttäjä kirjautuneena.
      const currentUser = context.currentUser

      // Jos kirjautunutta käyttäjää ei löydy, heitetään virhe.
      if (!currentUser) {
        throw new AuthenticationError('Unauthenticated.')
      }

      // Haetaan tietokannan kirjailijoiden joukosta parametrina
      // saatua nimeä vastaava kirjailija jos sellainen on olemassa.
      const correctAuthor = await Author.findOne({name: args.name})

      // Jos vastaavaa kirjailijaa
      // ei löydy, palautetaan null.
      if (!correctAuthor) {
        return null
      }
      
      // Asetetaan kirjailijan syntymävuoden
      // kenttään parametreina saatu syntymävuosi.
      correctAuthor.born = args.setBornTo

      // Yritetään muokatun kirjailijan tallentamista tietokantaan.
      try {
        const modifiedAuthor = await correctAuthor.save()
        return modifiedAuthor
      }
      // Virheen sattuessa heitetään virhe.
      catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    createUser: async (root, args) => {

      // Luodaan uusi käyttäjäolio.
      const newUser = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })

      // Yritetään luodun olion tallentamista tietokantaan.
      try {
        const returnedUser = await newUser.save()
        return returnedUser
      }
      // Heitetään virhe tallentamisen epäonnistuessa.
      catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    login: async (root, args) => {

      // Tarkistetaan löytyykö tietokannasta jo käyttäjäää,
      // joka vastaa parametreina saatua käyttäjätunnusta.
      const correctUser = await User.findOne({
        username: args.username
      })

      // Jos käyttäjää ei löydy tai salasana on
      // virheellinen, heitetään virhe.
      if ( !correctUser || args.password !== 'salainen' ) {
        throw new UserInputError('Wrong username or password.')
      }

      // Luodaan käyttäjälle allerkirjoitettu
      // Token-merkkijono, joka myös palautetaan.
      const userForToken = {
        username: correctUser.username,
        id: correctUser._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
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
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})