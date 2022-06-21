import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

const testBlog = {
  title: 'Testing blog.',
  author: 'Mr. Blogtester',
  user: {
    name: 'Mr. Blogtester',
    username: 'blogtester'
  },
  url: 'https://blogtester.com/testing',
  likes: 123
}

const styleNotVisible = {
  display: 'none'
}

test('By default, renders title & author, not URL & amount of likes.', () => {
  const mockHandleLike = jest.fn()
  const mockCheckCorrectUser = jest.fn()
  const mockRemove = jest.fn()

  const { container } = render(<Blog blog={testBlog} handleLike={mockHandleLike}
    checkCorrectUser={mockCheckCorrectUser} remove={mockRemove}/>)

  const titleAndAuthorDiv = container.querySelector('.titleAndAuthor')
  expect(titleAndAuthorDiv).toHaveTextContent('Testing blog.')
  expect(titleAndAuthorDiv).toHaveTextContent('Mr. Blogtester')

  const urlAndLikesDiv = container.querySelector('.urlAndLikes')
  expect(urlAndLikesDiv).toHaveTextContent('https://blogtester.com/testing')
  expect(urlAndLikesDiv).toHaveTextContent(123)
  expect(urlAndLikesDiv).toHaveStyle(styleNotVisible)
})