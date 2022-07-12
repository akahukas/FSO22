import { useEffect, useState } from 'react'

import { useMutation } from '@apollo/client'

import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries'

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

  return (
    <div>
      <h2>Set birthyear:</h2>

      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({target}) => setName(target.value)}
            required
          />
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
