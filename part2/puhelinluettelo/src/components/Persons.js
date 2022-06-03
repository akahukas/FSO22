import Button from './Button'

const Persons = ({personsToShow, persons, setPersons}) => {
    return (
      <div>
        {personsToShow.map(person =>
          <p key={person.name}>
          {person.name} {person.number} <Button 
                                          person={person}
                                          persons={persons}
                                          setPersons={setPersons}
                                        />
          </p>    
        )}  
      </div>
    )
  }

export default Persons
