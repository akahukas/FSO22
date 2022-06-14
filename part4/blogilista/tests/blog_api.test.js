const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./api_test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('Blogs are returned as JSON.', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Correct amount of blogs are returned.', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('Returned blogs have a field named id, not _id.', async () => {
    const response = await api.get('/api/blogs')

    const returnedBlog = response.body[0]
    expect(returnedBlog._id).toBeUndefined()
    expect(returnedBlog.id).toBeDefined()
})

test('A new valid blog can be added.', async () => {
    const newBlog = {
        title: 'Utilizing async/await.',
        author: 'A Waiter',
        url: 'https://asynchronizer.com',
        likes: 123
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDatabase()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).toContain(newBlog.title)
})

test('If value for likes is not given, its default value is 0.', async () => {
    const newBlog = {
        title: 'Who wants likes anyway.',
        author: 'Like H8r',
        url: 'https://iwantcomments.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDatabase()
    const returnedBlog = blogsAtEnd[blogsAtEnd.length - 1]

    expect(returnedBlog.likes).toBeDefined()
    expect(returnedBlog.likes).toBe(0)
})

test('A blog without title and url is not added.', async () => {
    const newBlog = {
        author: 'Liked Author',
        likes: 456
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})