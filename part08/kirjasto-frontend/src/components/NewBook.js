import { useState } from 'react'

import { useMutation } from '@apollo/client'

import { ALL_AUTHORS, ALL_BOOKS, ALL_BOOKS_GENRE, CREATE_BOOK } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  // Määritetään mutaatio muuttujaan, sekä lisätään
  // kyselyt tehtäväksi uudelleen mutaation yhteydessä.
  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      { query: ALL_AUTHORS },
      { query: ALL_BOOKS },
      { query: ALL_BOOKS_GENRE,
        variables: { genreFilter: genres[0] } },
    ],
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    // Muutetaan julkaisuvuosi merkkijonosta kokonaisluvuksi.
    const publishedInt = parseInt(published)

    // Käytetään mutaatiota, annetaan arvot sille muuttujien arvoina.
    createBook({variables: { title, author, publishedInt, genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add new book:</h2>

      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            required
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            required
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
