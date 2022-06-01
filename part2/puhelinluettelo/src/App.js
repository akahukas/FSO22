import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  // Lomakkeen tapahtumankäsittelijä.
  const addName = (event) => {
    
    // Estetään oletusarvoinen toiminta.
    event.preventDefault()

    // Tarkistetaan onko lisättävä nimi jo tietorakenteessa.
    const foundPerson = persons.find(
      ({name}) => name === newName
    )
    
    // Estetään tyhjän nimen lisääminen tietorakenteeseen.
    if (newName === '') {
      return
    }

    // Jos lisättävä nimi on jo tietorakenteessa.
    else if (foundPerson !== undefined) {

      // Tallennetaan muuttujaan viesti
      // ja annetaan käyttäjälle virheilmoitus.
      const alertMessage = `${newName} is already added to phonebook`
      window.alert(alertMessage)

      // Tyhjennetään syöttökenttä.
      setNewName('')
      
      return
    }
    
    // Jos lisättävä nimi on kelvollinen, luodaan yhteystieto-olio.
    const personObject = {
      name: newName
    }

    // Lisätään uusi yhteystieto-olio 
    // tietorakenteeseen ja tyhjennetään syöttökenttä.
    setPersons(persons.concat(personObject))
    setNewName('')
  }

  // Muutoksenkäsittelijä yhteystieto-olion nimen syöttökentälle.
  const handleNameChange = (event) => setNewName(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input
                  value={newName}
                  onChange={handleNameChange}
                />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(person =>
          <p key={person.name}>{person.name}</p>)}  
      </div>
    </div>
  )
}

export default App
