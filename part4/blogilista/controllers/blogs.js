const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)
    
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
    const blog = new Blog(request.body)

    const updatedBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    }
    
    const returnedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        updatedBlog,
        { new: true }
    )

    response.json(returnedBlog)
})

module.exports = blogsRouter