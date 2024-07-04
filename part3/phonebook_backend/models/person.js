const mongoose = require('mongoose')

url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

module.exports = mongoose.model('Person', personSchema)