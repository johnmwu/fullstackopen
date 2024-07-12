const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose')
const cors = require('cors')
const Blog = require('./models/blog.js')
const { errorHandler } = require('./utils/middleware')

const app = express()
app.use(cors())
app.use(express.json())

console.log('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)

app.get('/api/blogs', async (request, response) => {
  const blogs = await Blog
    .find({})
  response.json(blogs)
})

app.post('/api/blogs', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

app.use(errorHandler)

module.exports = app