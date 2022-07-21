import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@apollo/client'

import { ALL_AUTHORS, ALL_AUTHOR_NAMES, SET_BIRTHYEAR } from '../queries'

const BirthyearForm = ({ show, setError }) => {
  const [ name, setName ] = useState('')
  const [ birthyear, setBirthyear ] = useState('')

  // Määritetään mutaatio ja vastaus muuttujaan, sekä
  // lisätään kysely tehtäväksi uudelleen mutaation yhteydessä.
  const [ changeBirthyear, result ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [
      { query: ALL_AUTHORS },
    ]
  })

  // Kysytään palvelimelta kaikkien tiedossa olevien kirjailijoiden nimet.
  const resultAuthors = useQuery(ALL_AUTHOR_NAMES)

  const submit = async (event) => {
    event.preventDefault()

    // Muutetaan syntymävuosi merkkijonosta kokonaisluvuksi.
    const setBornToInt = parseInt(birthyear)

    // Käytetään mutaatiota, annetaan arvot sille muuttujien arvoina.
    changeBirthyear({ variables: { name, setBornToInt} })

    setName('')
    setBirthyear('')
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError('Person not found.')
    }
  }, [result.data]) // eslint-disable-line

  if (!show) {
    return null
  }

  // Jos kyselyyn ei ole vielä vastattu.
  if (resultAuthors.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  // Tallennetaan muuttujaan saatu vastaus kyselyyn.
  const authorNames = resultAuthors.data.allAuthors

  return (
    <div>
      <h2>Set birthyear:</h2>

      <form onSubmit={submit}>
        <div>
          <select
            value={name}
            onChange={({target}) => setName(target.value)}
          >
            {authorNames.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            value={birthyear}
            onChange={({target}) => setBirthyear(target.value)}
            required
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default BirthyearForm
