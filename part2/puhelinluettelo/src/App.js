import { useState, useEffect } from 'react'
import personService from './services/persons'
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
    personService
      .getAll()
      .then(initialPersons => {
        console.log('Promise fulfilled.')
        setPersons(initialPersons)
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

    // Luodaan yhteystieto-olio.
    const personObject = {
      name: newName,
      number: newNumber
    }
    
    // Jos haettu nimi on jo tietorakenteessa, kysytään 
    // käyttäjän halukkuutta muokata annettua yhteystietoa.
    if (foundPerson !== undefined) {

      const confirmMessage = `${newName} is already added to phonebook, replace the old number with a new one?`
      
      // Päivitetään määritetty yhteystieto palvelimelle
      // ja renderöidään muokatut yhteystiedot ruudulle.
      if (window.confirm(confirmMessage)) {
        personService
          .updateOld(foundPerson.id, personObject).then(returnedPerson => {
            setPersons(persons.map(person => person.id !== foundPerson.id ? person : returnedPerson))
          })
      }

      // Tyhjennetään syöttökentät.
      setNewName('')
      setNewNumber('')
      
      return
    }

    // Lähetetään yhteystieto-olio palvelimelle, renderöidään
    // muokattu tietorakenne ja tyhjennetään syöttökentät.
    personService
      .createNew(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
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
      <Persons 
        personsToShow={personsToShow}
        persons={persons}
        setPersons={setPersons}
      />
    </div>
  )
}

export default App
