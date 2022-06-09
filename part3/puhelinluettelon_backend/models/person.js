const mongoose = require('mongoose')

const targetUrl = process.env.MONGODB_URL

console.log('Connecting to', targetUrl)
mongoose.connect(targetUrl)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('An error occurred while connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedPerson) => {
        returnedPerson.id = returnedPerson._id.toString()
        delete returnedPerson._id
        delete returnedPerson.__v
    }
})

module.exports = mongoose.model('Person', personSchema)