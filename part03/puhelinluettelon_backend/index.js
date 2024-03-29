require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))

app.use(express.json())

// Luodaan morgan-middlewarelle uusi token,
// joka palauttaa requestin bodyn JSON-muodossa.
morgan.token('requestBody', (request) => {
  return JSON.stringify(request.body)
})

// Otetaan morgan käyttöön tiny-konfiguraatiolla,
// lisätään loppuun juuri luotu oma <requestBody>-token.
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody'))

// Otetaan CORS-middleware käyttöön.
const cors = require('cors')
app.use(cors())

/* Kovakoodatut yhteystiedot.
let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
      },
      {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
      },
      {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
      }
]*/

// Tapahtumankäsittelijä kaikkien palvelimelle
// tallennettujen yhteystietojen noutamiseen.
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Tapahtumakäsittelijä sivulle, josta nähdään palvelimelle
// tallennettujen yhteystietojen lukumäärän ja palvelimen määrittämä kellonaika.
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> ${new Date()}`)
  })
})

// Tapahtumakäsittelijä yksittäisen yhteystiedon noutamiseen palvelimelta.
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      // Jos yhteystieto löytyy, palautetaan se <json>-muodossa,
      // muussa tapauksessa vastataan statuskoodilla "404 Not Found".
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Tapahtumakäsittelijä yksittäisen yhteystiedon poistamiseen.
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Tapahtumakäsittelijä uuden yhteystiedon tallentamiseksi palvelimelle.
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // Vastataan statuskoodilla ja virheilmoituksella,
  // jos lähetetty yhteystieto ei sisältänyt nimeä.
  if (!body.name) {
    return response.status(400).json({
      error: 'Missing contact name.'
    })
  }
  // Vastataan statuskoodilla ja virheilmoituksella,
  // jos lähetetty yhteystieto ei sisältänyt puhelinnumeroa.
  else if (!body.number) {
    return response.status(400).json({
      error: 'Missing contact telephone number.'
    })
  }
  // Virheilmoitus, jos yhteystiedon nimeä tai numeroa ei ole määritelty.
  else if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({
      error: 'Missing contact information'
    })
  }
  // Luodaan yhteystieto-olio.
  const personObject = new Person({
    name: body.name,
    number: body.number
  })
  // Lisätään luotu olio MongoDB-tietokantaan
  // ja lähetetään se myös vastauksena.
  personObject.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// Tapahtumakäsittelijä jo tietokannassa olevan
// yhteystiedon puhelinnumeron muuttamiseksi.
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // Hyödynnetään findByIdAndUpdate() -metodia
  // juuri oikean yhteystiedon muokkaamiseen.
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(modifiedPerson => {
      response.json(modifiedPerson)
    })
    .catch(error => next(error))
})

// Virheenkäsittelijä-middleware.
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // Vääränmuotoisesta id:stä johtuva virhe.
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id.' })
  }
  // Yhteystieto-olion validoinnista johtuva virhe.
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// Määritellään virheet käsittelevä
// middleware viimeisenä käyttöön otettavaksi.
app.use(errorHandler)

const PORT = process.env.PORT || PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})