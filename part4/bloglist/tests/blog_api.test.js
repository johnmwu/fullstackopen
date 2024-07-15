const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  }
]

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'sekret'
  },
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen'
  }
]

beforeEach(async () => {
  await User.deleteMany({})
  const userPromises = initialUsers.map(user => api.post('/api/users').send(user))
  await Promise.all(userPromises)

  const token = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then(response => response.body.token)

  await Blog.deleteMany({})
  const blogPromises = initialBlogs.map(blog => api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blog))

  await Promise.all(blogPromises)
})

after(async () => {
  await mongoose.connection.close()
})

test.only('blogs are returned as json', async () => {
  // console.log("hello from test")
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.equal(response.body.length, 3)
})

test('a valid blog can be added', async () => {
  token = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then(response => response.body.token)

  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.equal(blogsAtEnd.length, initialBlogs.length + 1)

  const lastBlog = blogsAtEnd[blogsAtEnd.length - 1].toJSON()
  assert.equal(lastBlog.title, newBlog.title)
  assert.equal(lastBlog.author, newBlog.author)
  assert.equal(lastBlog.url, newBlog.url)
  assert.equal(lastBlog.likes, newBlog.likes)
})

test('blog json has id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  // has id
  const ids = response.body.map(b => b.id).filter(id => id)
  assert(ids.length === initialBlogs.length)

  // doesn't have _id
  const _ids = response.body.map(b => b._id).filter(id => id)
  assert(_ids.length === 0)
})

test('missing likes defaults to 0', async () => {
  token = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then(response => response.body.token)

  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)  

  const blogsAtEnd = await Blog.find({})
  assert.equal(blogsAtEnd.length, initialBlogs.length + 1)
  const lastBlog = blogsAtEnd[blogsAtEnd.length - 1].toJSON()
  assert.equal(lastBlog.likes, 0)
})

test('missing url or title returns 400', async () => {
  token = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then(response => response.body.token)

  const newBlog = {
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('delete blog', async () => {
  token = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then(response => response.body.token)

  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0].toJSON()
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  assert.equal(blogsAtEnd.length, initialBlogs.length - 1)
})

test('update blog', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0].toJSON()
  blogToUpdate.likes = 100
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.equal(blogsAtEnd.length, initialBlogs.length)
  assert.equal(blogsAtEnd[0].toJSON().likes, 100)
})

test('all users are returned', async () => {
  const response = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.equal(response.body.length, 2)
})

test('a valid user can be added', async () => {
  const newUser = {
    username: 'test',
    name: 'test',
    password: 'test'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})
  assert.equal(usersAtEnd.length, initialUsers.length + 1)

  const usernames = usersAtEnd.map(user => user.username)
  assert.ok(usernames.includes(newUser.username))
})

test('username must be unique', async () => {
  const newUser = {
    username: 'root',
    name: 'test',
    password: 'test'
  }
  response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.equal(response.body.error, 'expected `username` to be unique')

  const usersAtEnd = await User.find({})
  assert.equal(usersAtEnd.length, initialUsers.length)
})

test('password must be at least 3 characters long', async () => {
  const newUser = {
    username: 'test',
    name: 'test',
    password: 'te'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})
  assert.equal(usersAtEnd.length, initialUsers.length)
})

test('username must be at least 3 characters long', async () => {
  const newUser = {
    username: 'te',
    name: 'test',
    password: 'test'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  
  const usersAtEnd = await User.find({})
  assert.equal(usersAtEnd.length, initialUsers.length)
})
