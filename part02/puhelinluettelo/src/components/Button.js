import personService from '../services/persons'

const Button = ({person, persons, setPersons, setSuccessMessage}) => {

  // Tapahtumankäsittelijä yhteystiedon poistopainikkeelle.
  const handleClick = () => {
    
  // Jos käyttäjä haluaa varmasti poistaa yhteystiedon, lähetetään 
  // palvelimelle poistopyyntö sekä renderöidään ruudulle ilmoitus poiston
  // onnistumisesta ja vain palvelimella olevat yhteystiedot.
  if (window.confirm(`Delete ${person.name}?`)) {
    setSuccessMessage(`Removed ${person.name} from contacts.`)
    setTimeout(() => {setSuccessMessage(null)}, 5000)
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