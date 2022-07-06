import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    
    // Haetaan tiedot palvelimelta vain jos nimi on annettu 
    // syöttökenttään. (Vältetään ensimmäisestä renderöinnistä aiheutuva virhe.)
    if (name) {
      axios
      .get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
      .then(response => {
        setCountry(response.data[0])
      })

      // Jos maan hakemisessa ilmenee ongelmia, esim. maata
      // ei löydy annetulla nimellä, asetetaan maa takaisin
      // alkuperäiseen tilaansa.
      .catch((error) => {
        setCountry(null)
        console.log('An error occurred:', error.message)
      })
    }
  // Suoritetaan useEffect-hook vain jos
  // <name>-parametrin arvo on muuttunut.
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return <div>not found...</div>
  }

  return (
    <div>
      <h3>{country.name.common}</h3>
      <div>population {country.population}</div> 
      <div>capital {country.capital}</div>
      <img src={country.flags.png} height='100' alt={`flag of ${country.name.common}`}/> 
    </div>
  )  
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
