import Weather from "./Weather"

const CountryResult = ({ search, setSearch, countries }) => {

  if (search === '') {
    return (
      <div>
        Type into the searchbar
      </div>
    )
  }

  const filtered = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))
  if (filtered.length === 0) {
    return (
      <div>
        No matches
      </div>
    )
  } else if (filtered.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (filtered.length > 1) {
    return (
      <div>
        <ul>
          {filtered.map(country => <li key={country.name.common}>{country.name.common} <button onClick={() => setSearch(country.name.common)}>show</button></li>)}
        </ul>
      </div>
    )
  } else if (filtered.length === 1) {
    return (
      <div>
        <h2>{filtered[0].name.common}</h2>
        <div>capital {filtered[0].capital}</div>
        <div>area {filtered[0].area}</div>
        <h3>languages:</h3>
        <ul>
          {Object.values(filtered[0].languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={filtered[0].flags.png} alt={filtered[0].name.common} height="100" />

        <Weather country={filtered[0]} />
      </div>
    )
  }
}

export default CountryResult