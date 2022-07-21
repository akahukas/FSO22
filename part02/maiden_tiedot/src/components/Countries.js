import Country from './Country'

const Countries = ({filteredCountries, setFilter}) => {

    // Jos suodatinta vastaavia maita ei ole 
    // lainkaan renderöidään käyttäjälle ilmoitus.
    if (filteredCountries.length == 0) {
      return (
        <p>
          Country not found with specified filter, please try again.
        </p>
      )
    }
    // Jos suodatinta vastaavia maita on yli 10,
    // renderöidään käyttäjälle kehotus suodattimen muokkaamisesta.
    else if (filteredCountries.length > 10) {
      return (
        <p>
          Too many matches, specify another filter.
        </p>
      )
    }
    // Jos suodatinta vastaavia maita on 2-10 kappaletta
    // renderöidään ruudulle vastaavien maiden nimet ja nappi,
    // jota painaessa renderöityy ruudulle vain kyseisen maan tiedot.
    else if (filteredCountries.length > 1) {
      return (
        <div>
          {filteredCountries.map(country=>
            <div key={country.name.common}>
            {country.name.common} <button onClick={() => setFilter(country.name.common)}>
                                    Show information
                                  </button>   
            </div>)}  
        </div>
      )
    }
    // Muussa tapauksessa renderöidään ruudulle 
    // ainoa suodatinta vastaava valtio tietoineen.
    else {
      return (
        <div>
          <Country countryData={filteredCountries[0]}/>
        </div>
      )
    }
  }

export default Countries
