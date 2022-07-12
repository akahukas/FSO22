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
    editAuthor: async (root, args) => {

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
        return correctAuthor.save()
      }
      // Virheen sattuessa heitetään virhe.
      catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
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