import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS, ALL_BOOKS_GENRE, ALL_GENRES } from '../queries'

const Books = ({ show }) => {
  // Tallennetaan oletusarvoinen genresuodatin
  // muuttujaan koodin selventämiseksi.
  const defaultGenreFilter = 'all genres'
  const [genreFilter, setGenreFilter] = useState(defaultGenreFilter)

  // Tehdään kaikki genret hakeva kysely palvelimelle.
  const result = useQuery(ALL_GENRES)

  // Tehdään kaikki kirjat hakeva kysely palvelimelle
  // ainoastaan, jos genresuodatin on oletusarvossaan.
  const allBooks = useQuery(ALL_BOOKS, {
    skip: genreFilter !== defaultGenreFilter
  })

  // Tehdään tiettyyn genreen kuuluvat kirjat hakeva kysely
  // palvelimelle ainoastaan jos genresuodatin ei ole oletusarvossaan.
  const booksByGenre = useQuery(ALL_BOOKS_GENRE, {
    variables: { genreFilter },
    skip: genreFilter === defaultGenreFilter,
  })
  
  // Renderöidään komponentti ruudulle ainoastaan
  // jos parametrina saatu ehto toteutuu.
  if (!show) {
    return null
  }
  // Jos kyselyihin ei ole vielä vastattu.
  else if(result.loading || allBooks.loading || booksByGenre.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  // Määritetään renderöitävät kirjan genresuodattimen
  // sekä sen tilan mukaisen tehdyn kyselyn avulla.
  const books = genreFilter !== defaultGenreFilter
    ? booksByGenre.data.allBooks
    : allBooks.data.allBooks

  // Tallennetaan muuttujaan genrekyselyn mukana saatu vastaus.
  const allGenres = result.data.allBooks

  // Alustetaan taulukko, jonne tallennetaan uniikit
  // genrejen nimet, eli jossa kyselyn vastauksen mukana
  // tulleet identtiset genret eivät ole mukana. Tämän taulukon
  // alkioista luodaan painikkeet genresuodattimen asettamiseksi.
  let uniqueGenres = []

  // Lisätään oletusarvoinen genrefiltteri.
  uniqueGenres.push(defaultGenreFilter)
  
  // Lisätään vastauksen mukana saapuneista genreistä vain
  // ne, jotka eivät ole jo ennestään taulukon alkioina.
  allGenres.forEach(genreArray => {
    genreArray.genres.forEach(genre => {
      if (!uniqueGenres.includes(genre)) {
        uniqueGenres.push(genre)
      }
    })
  })

  return (
    <div>
      <h2>Books</h2>

      {// Genresuodattimen tilasta riippuvainen aputeksti.
        genreFilter === defaultGenreFilter
          ? <p>in <strong>all genres</strong>:</p>
          : <p>in genre <strong>{genreFilter}</strong>:</p>
      }

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

      <div>
        <p><strong>Select genre:</strong></p>
        {uniqueGenres.map((genre) => (
          <button 
            key={genre}
            value={genreFilter}
            onClick={() => {setGenreFilter(genre)}}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
