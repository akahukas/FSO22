import personService from '../services/persons'

const Button = ({person, persons, setPersons}) => {

  // Tapahtumankäsittelijä yhteystiedon poistopainikkeelle.
  const handleClick = () => {
    
  // Jos käyttäjä haluaa varmasti poistaa 
  // yhteystiedon, lähetetään palvelimelle 
  // poistopyyntö ja suodatetaan ruudulle näkyvät yhteystiedot.
  if (window.confirm(`Delete ${person.name}?`)) {
    personService
      .deleteOld(person.id)
      setPersons(persons.filter(validPerson => validPerson.id !== person.id))
  }  
  }
  
  return (
    <button onClick={handleClick}>Delete</button>
  )
}

export default Button