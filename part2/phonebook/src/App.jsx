import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import axios from 'axios'
import personService from './services/persons'
import Message from './components/Message'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    personService.getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()


    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      personService.update(existingPerson.id, {...existingPerson, number: newNumber})
        .then(response => {
          setPersons(persons.map(person => {
            return person.id === response.id ? response : person
          }))
        })
        .catch(() => {
          setMessage(`Information of ${newName} has already been removed from server`)
          setIsError(true)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
          setPersons(persons.filter(person => person.id !== existingPerson.id))
        })
      return
    }
  
    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject)
      .then(response => {
        console.log(`added ${newName} to phonebook`)
        setPersons(persons.concat(response))
        setMessage(`Added ${newName}`)
        setIsError(false)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch(error => {
        setMessage(error.response.data.error)
        setIsError(true)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
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

      <Message message={message} isError={isError} />

      <Filter newFilter={newFilter} handleFilterChange={(event) => setNewFilter(event.target.value)}/>

      <h2>Add a new</h2>
      <PersonForm newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} addPerson={addPerson} />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
