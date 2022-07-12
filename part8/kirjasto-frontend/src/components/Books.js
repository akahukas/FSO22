import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  // Tehdään kysely palvelimelle.
  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }
  // Jos kyselyyn ei ole vielä vastattu.
  else if(result.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  // Tallennetaan muuttujaan saatu vastaus kyselyyn.
  const books = result.data.allBooks

  return (
    <div>
      <h2>Books:</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
