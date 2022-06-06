const express = require('express')
const app = express()

app.use(express.json())

// Kovakoodatut yhteystiedot.
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
]


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Tapahtumakäsittelijä sivulle, josta nähdään palvelimelle 
// tallennettujen yhteystietojen lukumäärän ja palvelimen määrittämä kellonaika.
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> ${new Date()}`)
})

// Tapahtumakäsittelijä yksittäisen yhteystiedon noutamiseen palvelimelta.
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    // Jos yhteystieto löytyy, palautetaan se <json>-muodossa,
    // muussa tapauksessa vastataan statuskoodilla "404 Not Found".
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

// Tapahtumakäsittelijä yksittäisen yhteystiedon poistamiseen.
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// Funktio luo kutsuttaessa satunnaisluvun väliltä 0-1000.
const generateId = () => {
    const min = Math.ceil(0)
    const max = Math.floor(1000)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Tapahtumakäsittelijä uuden yhteystiedon tallentamiseksi palvelimelle.
app.post('/api/persons', (request, response) => {
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
    // Vastataan statuskoodilla ja virheilmoituksella,
    // jos samalla nimellä varustettu yhteystieto löytyy jo palvelimelta.
    else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Contact name must be unique.'
        })
    }
    // Luodaan yhteystieto-olio.
    const personObject = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    // Lisätään luotu olio palvelimen tietorakenteeseen 
    // ja lähetetään se myös vastauksena.
    persons = persons.concat(personObject)
    response.json(personObject)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})