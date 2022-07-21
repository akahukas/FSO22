const mongoose = require('mongoose')

const targetUrl = process.env.MONGODB_URL

console.log('Connecting to', targetUrl)
mongoose.connect(targetUrl)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('An error occurred while connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      // Kustomoitu Regex -validointi yhteystiedon
      // puhelinnumerolle. Sallii alkuun 2-3 numeroa,
      // jonka jälkeen väliviiva ja haluttu määrä numeroita.
      validator: (number) => {
        return /^\d{2,3}-\d+$/.test(number)
      }
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedPerson) => {
    returnedPerson.id = returnedPerson._id.toString()
    delete returnedPerson._id
    delete returnedPerson.__v
  }
})

module.exports = mongoose.model('Person', personSchema)