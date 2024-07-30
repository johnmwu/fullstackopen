const { test, expect, describe, beforeEach } = require('@playwright/test')
const { login, createBlog } = require('./helper')

describe('Bloglist app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen 2',
        username: 'mluukkai2',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginHeading = page.getByRole('heading', { name: 'log in to application' })

    await expect(loginHeading).toBeVisible()
  })

  test('User can login', async ({ page }) => {
    await page.locator('#username').fill('mluukkai')
    await page.locator('#password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
  })

  test('Failed login', async ({ page }) => {
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Wrong credentials')).toBeVisible()
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'mluukkai', 'salainen')
    })

    describe('With multiple blogs', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Test blog 1', 'Test author 1', 'Test url 1')
        await createBlog(page, 'Test blog 2', 'Test author 2', 'Test url 2')
        await createBlog(page, 'Test blog 3', 'Test author 3', 'Test url 3')
      })

      test('A blog can be created', async ({ page }) => {
        await createBlog(page, 'Another test blog', 'Test author', 'Test url')

        await expect(page.getByText('Another test blog')).toBeVisible()

      })

      test('A blog can be liked', async ({ page }) => {
        const blogText = page.getByText('Test blog 1')
        const blogElement = blogText.locator('..')

        await blogElement.getByRole('button', { name: 'view' }).click()

        await blogElement.getByRole('button', { name: 'like' }).click()

        await expect(blogElement.getByText('likes 1')).toBeVisible()

      })

      test('A blog can be deleted', async ({ page }) => {
        const blogText = page.getByText('Test blog 1')
        const blogElement = blogText.locator('..')

        await blogElement.getByRole('button', { name: 'view' }).click()


        // say yes to window alert dialog
        await page.on('dialog', dialog => dialog.accept())
        await blogElement.getByRole('button', { name: 'remove' }).click()

        await expect(blogText).not.toBeVisible()
      })

      test('Blogs are ordered according to likes', async ({ page }) => {
        const blog1 = page.locator('.blog').filter({ hasText: 'Test blog 1' })
        const blog2 = page.locator('.blog').filter({ hasText: 'Test blog 2' })
        const blog3 = page.locator('.blog').filter({ hasText: 'Test blog 3' })

        await blog1.getByRole('button', { name: 'view' }).click()
        await blog2.getByRole('button', { name: 'view' }).click()
        await blog3.getByRole('button', { name: 'view' }).click()

        await blog3.getByRole('button', { name: 'like' }).click()
        await blog3.getByText('likes 1').waitFor()

        await blog3.getByRole('button', { name: 'like' }).click()
        await blog3.getByText('likes 2').waitFor()

        await blog2.getByRole('button', { name: 'like' }).click()
        await blog2.getByText('likes 1').waitFor()


        const blogList = page.getByTestId('bloglist')
        const first = blogList.locator('li').locator('nth=0')
        const second = blogList.locator('li').locator('nth=1')
        const third = blogList.locator('li').locator('nth=2')

        await expect(first).toContainText('Test blog 3')
        await expect(second).toContainText('Test blog 2')
        await expect(third).toContainText('Test blog 1')
      })

      test('Other user can not delete', async ({ page }) => {
        // logout

        await page.getByRole('button', { name: 'logout' }).click()

        // login as other user
        await login(page, 'mluukkai2', 'salainen')

        const blogText = page.getByText('Test blog 1')
        const blogElement = blogText.locator('..')

        await blogElement.getByRole('button', { name: 'view' }).click()
        expect(blogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()

        // say no to window alert dialog)
      })
    })
  })
})