import { useState, useEffect } from 'react'
import axios from 'axios'

import Countries from './components/Countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [isFilterEmpty, setIsFilterEmpty] = useState(true)

  // Haetaan palvelimelta maiden tietorakenne Effect-hookilla.
  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }

  useEffect(hook, [])

  // Tapahtumankäsittelijä filtterin syöttökentälle.
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    if (event.target.value == '') {
      setIsFilterEmpty(true)
    }
    else {
      setIsFilterEmpty(false)
    }
  }

  // Suodatetaan ruudulla näkyvät maat <isFilterEmpty> -tilasta riippuen.
  const countriesToShow = isFilterEmpty
    ? countries
    : countries.filter((country) => country.name.common.toLowerCase()
                                    .includes(newFilter.toLowerCase()))

  return (
    <div>
      <div>Find countries: <input 
                              value={newFilter}
                              onChange={handleFilterChange}
                            />
      </div>
      <Countries filteredCountries={countriesToShow} setFilter={setNewFilter} />
    </div>
  )
}

export default App

