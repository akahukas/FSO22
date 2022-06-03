import Button from './Button'

const Persons = ({personsToShow, persons, setPersons, setSuccessMessage}) => {
    return (
      <div>
        {personsToShow.map(person =>
          <p key={person.name}>
          {person.name} {person.number} <Button 
                                          person={person}
                                          persons={persons}
                                          setPersons={setPersons}
                                          setSuccessMessage={setSuccessMessage}
                                        />
          </p>    
        )}  
      </div>
    )
  }

export default Persons
