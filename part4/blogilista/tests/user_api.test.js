const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./api_test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')

describe('Adding first user to database', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('Successful creation of a new user.', async () => {
        const usersAtStart = await helper.usersInDatabase()

        const newUser = {
            name: 'Test Person',
            username: 'testUsername',
            password: 'testPassword'
          }
      
          await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
      
          const usersAtEnd = await helper.usersInDatabase()
          expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
      
          const usernames = usersAtEnd.map(user => user.username)
          expect(usernames).toContain(newUser.username)
    })
})