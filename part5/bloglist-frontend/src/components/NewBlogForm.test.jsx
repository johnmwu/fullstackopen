import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

describe('NewBlogForm', () => {
  let handleCreate, title, setTitle, author, setAuthor, url, setUrl
  let component

  beforeEach(() => {
    handleCreate = vi.fn()
    title = ''
    setTitle = vi.fn()
    author = ''
    setAuthor = vi.fn()
    url = ''
    setUrl = vi.fn()

    component = render(
      <NewBlogForm
        handleCreate={handleCreate}
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        url={url}
        setUrl={setUrl}
      />
    )
  })

  test('calls handleCreate with correct arguments on submit', async () => {

    const form = component.container.querySelector('form')
    const submitButton = form.querySelector('button')

    const titleInput = component.container.querySelector('.title')
    const authorInput = component.container.querySelector('.author')
    const urlInput = component.container.querySelector('.url')

    await userEvent.type(titleInput, 'title from test')
    await userEvent.type(authorInput, 'author from test')
    await userEvent.type(urlInput, 'url from test')

    await userEvent.click(submitButton)

    expect(handleCreate.mock.calls).toHaveLength(1)

    // console.log(handleCreate.mock.calls)
    expect(handleCreate.mock.calls[0][0].title).toBe('title from test')
    expect(handleCreate.mock.calls[0][0].author).toBe('author from test')
    expect(handleCreate.mock.calls[0][0].url).toBe('url from test')
  }
  )

})

