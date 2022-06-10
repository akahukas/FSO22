const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('Give your MongoDB-password as an argument!')
  process.exit(1)
}

const userPassword = process.argv[2]

const targetUrl = `mongodb+srv://sakusaku:${userPassword}@cluster0.5xg38ny.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(targetUrl)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log(`Added ${person.name} with telephone number ${person.number} to phonebook.`)
    mongoose.connection.close()
  })
}
else if(process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
else {
  console.log('Wrong number of command line arguments!')
  mongoose.connection.close()
}
