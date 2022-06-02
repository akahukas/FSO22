import { useState, useEffect } from 'react'
import axios from 'axios'

const CapitalWeather = ({city}) => {
    const [currentWeather, setCurrentWeather] = useState(null)
  
    // Sään noutamiseen käytettävä API-avain.
    const apiKey = process.env.REACT_APP_API_KEY
  
    // Määritellään URL-osoite, josta säätiedot noudetaan.
    // Lisätään searchParams.set() -metodin avulla osoitteelle hakuparametreja.
    const weatherAddress = new URL("https://api.openweathermap.org/data/2.5/weather")
  
    weatherAddress.searchParams.set("q", `${city}`)
    weatherAddress.searchParams.set("appid", `${apiKey}`)
    weatherAddress.searchParams.set("units", "metric")
  
    // Noudetaan palvelimelta kaupungin säätiedot Effect-hookilla.
    const getWeatherData = () => {
      axios
        .get(weatherAddress)
        .then(response => {
          setCurrentWeather(response.data)
        })
    }
  
    useEffect(getWeatherData, [])
    
    // Ensimmäisellä renderöinnillä palataan suoraan takaisin.
    // Tällä vältetään virheilmoituksen ilmaantuminen konsolissa.
    if (currentWeather === null) {
      return
    }
    // Muilla kerroilla haetaan palvelimelta 
    // säätilaa vastaava ikoni ja renderöidään tiedot näytölle.
    else {
      const currentWeatherIcon = currentWeather?.weather[0].icon
      const iconAddress = new URL(`http://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png`)
    
    return (
      <div>
        <h2><strong>Weather in {city}:</strong></h2>
        <p>
          Temperature: {currentWeather?.main.temp} Celsius
        </p>
        <img src={iconAddress} />
        <p>
          Wind: {currentWeather?.wind.speed} m/s
        </p>
      </div>
    )
    }
  }

export default CapitalWeather
