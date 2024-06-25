import { useState, useEffect } from 'react'

const CountryForm = ({setSearch}) => {
  return <>
  <p>find countries <input onChange={(event) => setSearch(event.target.value)} /></p>
  </>
}

export default CountryForm