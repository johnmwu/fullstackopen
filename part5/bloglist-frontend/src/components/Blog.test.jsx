import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  let component, likeBlog, removeBlog, user

  beforeEach(() => {
    const blog = {
      title: 'title',
      author: 'author',
      url: 'url',
      likes: 0,
      user: { username: 'username', name: 'name' }
    }

    likeBlog = vi.fn()
    removeBlog = vi.fn()
    user = {
      username: 'username',
      name: 'name'
    }
    component = render(<Blog blog={blog} addLike={likeBlog} handleRemove={removeBlog} user={user}/>)
  })

  test('Blog renders title and author but not url and likes by default', () => {
    // const div = component.container.querySelector('.blog')

    expect(component.container).toHaveTextContent(
      'title'
    )

    expect(component.container).toHaveTextContent(
      'author'
    )

    expect(component.container).not.toHaveTextContent(
      'url'
    )

    expect(component.container).not.toHaveTextContent(
      'likes'
    )
  })

  test('Blog renders url and likes when view button is clicked', async () => {
    const button = component.getByText('view')

    await userEvent.click(button)

    expect(component.container).toHaveTextContent(
      'url'
    )

    expect(component.container).toHaveTextContent(
      'likes'
    )
  })

  test('When like button clicked twice, event handler is called twice', async () => {
    const button = component.getByText('view')

    await userEvent.click(button)
    const likeButton = component.getByText('like')

    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})

