import { useState } from 'react'

const NewBlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={() => handleCreate({ title, author, url })}>
        <div>
          title
          <input
            type="text"
            data-testid="title-input"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            className="title"
          />
        </div>
        <div>
          author
          <input
            type="text"
            data-testid="author-input"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            className="author"
          />
        </div>
        <div>
          url
          <input
            type="text"
            data-testid="url-input"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            className="url"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default NewBlogForm