// @ts-check

const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const usersRouter = express.Router()

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, id: 1 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password === undefined || body.username === undefined) {
    return response.status(400).json({ error: 'username and password are required' })
  }

  if (body.password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  if (body.username.length < 3) {
    return response.status(400).json({ error: 'username must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter