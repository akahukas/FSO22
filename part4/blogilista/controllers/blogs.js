const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', {name: 1, username:1})
    
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
    const body = request.body
    const user = request.user

    if (!user) {
        return response.status(401).json({
            error: 'Missing or Invalid Token.'
        })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        user: user._id,
        url: body.url,
        likes: body.likes
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
    
    const user = request.user

    if (!user) {
        return response.status(401).json({
            error: 'Missing or Invalid Token.'
        })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({
            error: 'Blog not found.'
        })
    }
    else if (!blog.user || blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)

        return response.status(204).end()
    }
    
    response.status(403).json({
        error: 'Deletion forbidden, this blog is not yours.'
    })
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