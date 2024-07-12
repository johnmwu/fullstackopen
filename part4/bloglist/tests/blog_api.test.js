const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
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

beforeEach(async () => {
  // TODO: parallel saving to database
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
})

test.only('blogs are returned as json', async () => {
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
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.equal(blogsAtEnd.length, initialBlogs.length + 1)

  const lastBlogWithoutId = blogsAtEnd[blogsAtEnd.length - 1].toJSON()
  delete lastBlogWithoutId.id
  assert.deepStrictEqual(lastBlogWithoutId, newBlog)
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
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)  

  const blogsAtEnd = await Blog.find({})
  assert.equal(blogsAtEnd.length, initialBlogs.length + 1)
  const lastBlog = blogsAtEnd[blogsAtEnd.length - 1].toJSON()
  assert.equal(lastBlog.likes, 0)
})

test('missing url or title returns 400', async () => {
  const newBlog = {
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('delete blog', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0].toJSON()
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
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

after(async () => {
  await mongoose.connection.close()
})