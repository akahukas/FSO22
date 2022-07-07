import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  // Lisätään mahdollisuus kentän arvon nollaamiseen.
  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  // Hook kaikkien resurssien hakemiseksi ja tilaan asettamiseksi.
  const getAll = () => {
    const request = axios.get(baseUrl)
    request.then((response) => {
      setResources(response.data)
    })
  }

  // Suoritetaan effect-hook alussa.
  useEffect(getAll, [baseUrl])

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)
    getAll()
    return response.data
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  // Erotetaan kustakin syöttökentästä mahdollisuus kentän nollaamiseen.
  const { reset: resetContentValue, ...content } = useField('text')
  const { reset: resetNameValue, ...name } = useField('text')
  const { reset: resetNumberValue, ...number } = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })

    // Nollataan muistiinpanokenttä.
    resetContentValue()
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})

    // Nollataan nimi- ja numerokentät.
    resetNameValue()
    resetNumberValue()
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} required />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} required /> <br/>
        number <input {...number} required />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App