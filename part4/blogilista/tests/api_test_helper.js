const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'The Blog',
        author: 'Saku',
        url: 'https://theblog.com',
        likes: 8
    },
    {
        title: 'A new blog',
        author: 'Test Person',
        url: 'https://newblog.com',
        likes: 4
    },
    {
        title: 'Interesting topics',
        author: 'Boring Guy',
        url: 'https://interestingnotboring.com',
        likes: 2
    },
]

const blogsInDatabase = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDatabase
}