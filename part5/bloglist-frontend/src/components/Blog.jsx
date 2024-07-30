import { useState } from 'react'

const Blog = ({ blog, addLike, handleRemove, user }) => {
  const [expanded, setExpanded] = useState(false)

  if (!expanded) {
    return (
      <div className='blog'>
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setExpanded(true)}>view</button>
        </div>
      </div>
    )
  } else {
    return (
      <div className='blog'>
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setExpanded(false)}>hide</button>
        </div>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          likes {blog.likes}
          <button onClick={() => addLike(blog)}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div>
          {user.username === blog.user.username ? <button onClick={() => handleRemove(blog)}>remove</button> : null}
        </div>
      </div>
    )
  }
}

export default Blog