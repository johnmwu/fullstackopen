require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => { 
      response.json(persons) 
      // mongoose.connection.close()
    })
})

app.get('/info', (request, response) => {
  Person.find({})
    .then(persons => { 
      response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
      mongoose.connection.close()
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = 10000
  return Math.floor(Math.random() * maxId)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
    // mongoose.connection.close()
  })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
