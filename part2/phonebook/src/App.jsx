import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import axios from 'axios'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    personService.getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.map(person => person.name).includes(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject)
      .then(response => {
        console.log(`added ${newName} to phonebook`)
        setPersons(persons.concat(personObject))
      })
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter newFilter={newFilter} handleFilterChange={(event) => setNewFilter(event.target.value)}/>

      <h2>Add a new</h2>
      <PersonForm newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} addPerson={addPerson} />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
