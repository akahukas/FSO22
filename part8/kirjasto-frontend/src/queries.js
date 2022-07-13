import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $publishedInt: Int!, $genres: [String!]!) {
    addBook(
      title: $title
      author: $author
      published: $publishedInt
      genres: $genres
    ) {
      title
    }
  }
`

export const SET_BIRTHYEAR = gql`
  mutation editAuthor($name: String!, $setBornToInt: Int!) {
    editAuthor(name: $name, setBornTo: $setBornToInt) {
      name
      born
    }
  }
`

export const ALL_AUTHOR_NAMES = gql`
  query {
    allAuthors {
      name
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
