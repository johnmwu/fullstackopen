import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Message from './components/Message'
import Togglable from './components/Togglable'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // blog form
  // const [title, setTitle] = useState('')
  // const [author, setAuthor] = useState('')
  // const [url, setUrl] = useState('')

  // message
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const addBlogFormRef = useRef()

  const orderBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(orderBlogs(blogs))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setMessage(`Welcome ${user.name}`)
      setIsError(false)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setMessage('Wrong credentials')
      setIsError(true)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreate = async ({ title, author, url }) => {
    // event.preventDefault()

    try {
      const blog = {
        title, author, url
      }
      addBlogFormRef.current.toggleVisibility()

      const newBlog = await blogService.create(blog)
      setBlogs(orderBlogs(blogs.concat(newBlog)))
      setTitle('')
      setAuthor('')
      setUrl('')

      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setIsError(false)

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)

      setMessage(exception.response.data.error)
      setIsError(true)

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addLike = async blog => {
    const newBlog = { ...blog, likes: blog.likes + 1 }
    const updatedBlog = await blogService.update(blog.id, newBlog)

    setBlogs(orderBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog)))

    setMessage(`blog ${updatedBlog.title} by ${updatedBlog.author} liked`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleRemove = async blog => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      setBlogs(orderBlogs(blogs.filter(b => b.id !== blog.id)))
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Message message={message} isError={isError} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id="username"
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <Message message={message} isError={isError} />
        <div>
          {user.name} logged in
          <button id="logout-button" onClick={handleLogout}>logout</button>
        </div>

        <Togglable buttonLabel="new blog" ref={addBlogFormRef}>
          <NewBlogForm handleCreate={handleCreate} />
        </Togglable>



        <ol
          data-testid="bloglist"
        >
            {blogs.map(blog =>
              <li key={blog.id} data-testid="blog">
                <Blog key={blog.id} blog={blog} addLike={addLike} handleRemove={handleRemove} user={user} />
              </li>
            )}
        </ol>
      </div>
    )
  }


}

export default App