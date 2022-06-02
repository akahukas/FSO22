import CapitalWeather from './CapitalWeather'

const Country = ({countryData}) => {

    // Tallennetaan taulukkoon maassa puhutut kielet.
    const spokenLanguages = Object.values(countryData.languages)
  
    return (
      <div>
        <h1>{countryData.name.common}</h1>
        <p>
          Capital: {countryData.capital}
        </p>
        <p>
          Area: {countryData.area}
        </p>
        <h3><strong>Language(s) spoken:</strong></h3>
        <ul>
          {spokenLanguages.map(language =>
            <li key={language}>
              {language}
            </li>
          )}
        </ul>
        <img src={countryData.flags.png}></img>
        <CapitalWeather city={countryData.capital}/>
      </div>
    )
  }

export default Country
