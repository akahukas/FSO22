import { useQuery } from '@apollo/client'

import { ME_GENRE, ALL_BOOKS_GENRE } from '../queries'

const RecommendedBooks = ({ show }) => {
  // Kysytään palvelimelta kirjautuneen
  // käyttäjän suosikkigenreä.
  const result = useQuery(ME_GENRE)

  // Määritetään muuttujaan suosikkigenre
  // riippuen onko vastaus jo saapunut vai ei.
  const favoriteGenre = result.data
    ? result.data.me.favoriteGenre
    : null
  
  // Tehdään suosikkigenren kirjat hakeva kysely vain
  // jos vastaus suosikkigenrekyselyyn on jo saapunut.
  const booksByGenre = useQuery(ALL_BOOKS_GENRE, {
    variables: { genreFilter: favoriteGenre },
    skip: !favoriteGenre,
  })

  // Renderöidään komponentti ruudulle ainoastaan
  // jos parametrina saatu ehto toteutuu.
  if (!show) {
    return null
  }
  // Jos kyselyihin ei ole vielä vastattu.
  else if(result.loading || booksByGenre.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  // Määritetään muuttujaan vastauksen mukana
  // saapuneet suosikkigenreen kuuluvat kirjat.
  const books = booksByGenre.data.allBooks

  return (
    <div>
      <h2>Recommended books:</h2>

      <p>Books from your favorite genre, <strong>{favoriteGenre}</strong>:</p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecommendedBooks
