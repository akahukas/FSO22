import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setToken, setError, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  // Määritetään mutaatio ja vastaus muuttujiin.
  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  // Suoritetaan useEffect-hook vastauksen datan muuttuessa.
  useEffect(() => {
    if (result.data) {
      // Jos data on olemassa eli kirjautuminen on onnistunut
      // asetetaan Token muuttujaan, sovelluksen tilaan sekä localStorageen.
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('libraryUserToken', token)
      
      // Siirrytään etusivulle, jolloin kirjautumiskomponentin
      // sulkeutuessa ei päädytä tyhjään näkymään.
      setPage('authors')
    }
  }, [result.data]) // eslint-disable-line

  // Renderöidään sovellus vain
  // parametrina saadun ehdon toteutuessa.
  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    // Suoritetaan kirjautumismutaatio, välitetään
    // käyttäjätunnus ja salasana parametreina.
    login({ variables: { username, password } })
  }
  
  return (
    <div>
      <h2>Login:</h2>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            type='text'
            onChange={({target}) => setUsername(target.value)}
            required
          />
        </div>
        <div>
          password
          <input
            value={password}
            type='password'
            onChange={({target}) => setPassword(target.value)}
            required
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm