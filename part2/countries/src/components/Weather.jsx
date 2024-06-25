import { useState, useEffect } from 'react'
import axios from 'axios'

const OPENWEATHERMAP_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY

const Weather = ({ country }) => {
  const [weather, setWeather] = useState({})
  const [lat, lon] = country.latlng

  useEffect(() => {
    console.log('effect')
    axios
      .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}`)
      .then(response => {
        console.log('promise fulfilled')
        setWeather(response.data)
      })
  }, [country])

  if (Object.keys(weather).length === 0) {
    return (
      <div>
        <h2>Weather in {country.capital[0]}</h2>
        Loading...
      </div>
    )
  }

  return (
    <>
    <h2>Weather in {country.capital[0]}</h2>
    <p>temperature {(weather.current.temp - 273.15).toFixed(2)} Celsius</p>
    <img src={`http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} alt={weather.current.weather[0].description} />
    <p>wind {weather.current.wind_speed.toFixed(2)} m/s</p>
    </>
  )
}

export default Weather