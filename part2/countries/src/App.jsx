import { useState, useEffect } from 'react'
import axios from 'axios'

import CountryForm from './components/CountryForm'
import CountryResult from './components/CountryResult'
import Weather from './components/Weather'

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  return <>
    <CountryForm setSearch={setSearch}/>
    <CountryResult search={search} setSearch={setSearch} countries={countries}/>
  </>
}

export default App
