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

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
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
  }
`

// Resolverit eli miten kyselyihin vastataan.
const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      
      // Jos kirjailijaa ei annettu
      // parametrina, palautetaan kaikki kirjat.
      if (!args.author && !args.genre) {
        return Book.find({})
      }
      // Jos parametrina annettu vain kirjailija,
      // palautetaan kyseisen kirjailijan kirjoittamat kirjat.
      else if (!args.genre) {
        return books.filter((book) => book.author === args.author)
      }
      // Jos parametrina on annettu vain genre,
      // palautetaan kyseistä genreä olevat kirjat.
      else if (!args.author) {
        return books.filter((book) =>
          book.genres.includes(args.genre)
        )
      }
      // Jos parametrina annettu sekä kirjailija että genre,
      // palautetaan kirjat, jotka täyttävät kummankin ehdon.
      else if (args.author && args.genre) {

        // Haetaan kaikki parametrina saadun
        // kirjailijan kirjoittamat kirjat.
        const booksByCorrectAuthor = books.filter(
          (book) => book.author === args.author
        )
        // Palautetaan edelläm määritetyistä kirjoista vain ne,
        // jotka vastaavat parametrina saatua genreä.
        return booksByCorrectAuthor.filter((book) =>
          book.genres.includes(args.genre)
        )
      }
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: (root) => (
      books.filter((book) => book.author === root.name).length
    )
  },
  Mutation: {
    addBook: async (root, args) => {

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
        return book.save()
      }
      // Virheen sattuessa heitetään virhe.
      catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    editAuthor: (root, args) => {

      // Haetaan tiedettyjen kirjailijoiden joukosta parametrina
      // saatua nimeä vastaava kirjailija jos sellainen on olemassa.
      const correctAuthor = authors.find((author) => author.name === args.name)

      // Jos vastaavaa kirjailijaa
      // ei löydy, palautetaan null.
      if (!correctAuthor) {
        return null
      }
      
      // Luodaan muokattu kirjailijaolio, kopioidaan muut kentät
      // paitsi syntymävuosi, jolle asetetaan parametreissa annettu arvo.
      const modifiedAuthor = {
        ...correctAuthor,
        born: args.setBornTo
      }

      // Korvataan järjestelmässä alkuperäinen kirjailija,
      // muokatulla versiolla. Muut oliot säilyvät ennallaan.
      authors = authors.map((author) => author.name === args.name
        ? modifiedAuthor
        : author
      )

      // Palautetaan muokattu olio.
      return modifiedAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})