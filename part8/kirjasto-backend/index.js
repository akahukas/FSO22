const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

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
    author: String!
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
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      
      // Jos kirjailijaa ei annettu
      // parametrina, palautetaan kaikki kirjat.
      if (!args.author && !args.genre) {
        return books
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
    allAuthors: () => authors,
  },
  Author: {
    bookCount: (root) => (
      books.filter((book) => book.author === root.name).length
    )
  },
  Mutation: {
    addBook: (root, args) => {

      // Tallennetaan taulukkoon kaikkien
      // tiedossa olevien kirjailijoiden nimet.
      const authorNames = authors.map((author) => author.name)

      // Jos parametrina saatu kirjailija ei ole
      // tiedossa, lisätään hänet järjestelmään.
      if (!authorNames.includes(args.author)) {
        
        // Luodaan kirjailijaolio; nimi annettu parametreissa,
        // syntymävuodesta ei tietoa. Lisäksi määritetään uniikki id.
        const author = {
          name: args.author,
          id: uuid(),
          born: null
        }
        // Lisätään luotu olio kirjailijoiden perälle.
        authors = authors.concat(author)
      }

      // Luodaan uusi kirjaolio parametreina saaduista
      // arvoista, sekä annetaan lisäksi uniikki id.
      const book = { ...args, id: uuid() }

      // Lisätään luotu olio kirjojen perälle,
      // ja palautetaan luotu kirja.
      books = books.concat(book)
      return book
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