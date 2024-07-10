const mongoose = require('mongoose')
const Person = require('./models/person')


if (process.argv.length === 3) {
  // print all entries
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  // add a new entry
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person
    .save()
    .then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
}