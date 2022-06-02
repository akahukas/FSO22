import { useState, useEffect } from 'react'
import axios from 'axios'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(true)

  // Haetaan Effect-hookilla yhteystiedot paikalliselta
  // palvelimelta ja asetetaan ne tilaan ruudulle.
  const hook = () => {
    console.log('Effect.')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('Promise fulfilled.')
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])

  // Lomakkeen tapahtumankäsittelijä.
  const addName = (event) => {
    
    // Estetään oletusarvoinen toiminta.
    event.preventDefault()

    // Tarkistetaan onko lisättävä nimi jo tietorakenteessa.
    const foundPerson = persons.find(
      ({name}) => name === newName
    )
    
    if (foundPerson !== undefined) {

      // Tallennetaan muuttujaan viesti
      // ja annetaan käyttäjälle virheilmoitus.
      const alertMessage = `${newName} is already added to phonebook`
      window.alert(alertMessage)

      // Tyhjennetään syöttökentät.
      setNewName('')
      setNewNumber('')
      
      return
    }
    
    // Jos lisättävä nimi on kelvollinen, luodaan yhteystieto-olio.
    const personObject = {
      name: newName,
      number: newNumber
    }

    // Lisätään uusi yhteystieto-olio 
    // tietorakenteeseen ja tyhjennetään syöttökentät.
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  // Muutoksenkäsittelijät yhteystieto-olion 
  // nimen ja puhelinnumeron syöttökentille.
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  
  // Tapahtumankäsittelijä filtterin syöttökentälle.
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    if (newFilter === '') {
      setShowAll(true)
    }
    else {
      setShowAll(false)
    }
  }

  // Määritetään muuttujaan näytettävät 
  // yhteystiedot riippuen tilasta <showAll>.
  const personsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterValue={newFilter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new contact:</h3>
      <PersonForm handleSubmit={addName} nameValue={newName} 
            handleNameChange={handleNameChange} numberValue={newNumber}
            handleNumberChange={handleNumberChange}/>
      <h3>Contacts:</h3>
      <Persons personsToShow={personsToShow}/>
    </div>
  )
}

export default App
