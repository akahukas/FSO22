const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const body = request.body

    const existingUser = await User.findOne({username: body.username})
    if (existingUser) {
        return response.status(400).json({
            error: 'Username must be unique.'
        })
    }

    if (body.password === undefined ||
        body.username === undefined) {
        return response.status(400).json({
            error: 'Missing username or password.'
        })
    }
    else if (body.password.length < 3) {
        return response.status(400).json({
            error: 'Password must be atleast 3 characters long.'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        passwordHash,
        name: body.name
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter