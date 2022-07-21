import { useState } from 'react'

// Palauttaa satunnaisluvun minimin 0 ja maksimin 6 välillä, 
// jotka vastaavat anecdotes-taulukossa olevien tekstien indeksejä.
const getRandomNumber = () => {
  return (
    Math.floor(Math.random() * 7)
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)

  // Alustetaan tietorakenne anekdoottitaulukon 
  // pituiseksi ja täytetään se nollilla.
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  // Haetaan äänitietorakenteesta suurin äänien määrä ja
  // kyseisen äänimäärän indeksi. Tallennetaan ne muuttujiin.
  const mostVotes = Math.max(...votes)
  const mostVotesIndex = votes.indexOf(mostVotes)

  // Äänestysnapin tapahtumakäsittelijä.
  const handleVote = () => {
    // Kopioidaan alkup. taulukko muuttujaan.
    let votes_copy = [...votes]

    // Kasvatetaan ruudulla näkyvän anekdootin
    // äänimäärää tietorakenteessa.
    votes_copy[selected] += 1

    // Asetetaan kopio alkup. tietorakenteen tilaksi
    // ja tulostetaan ilmoitus konsoliin lisätystä äänestä.
    setVotes(votes_copy)
    console.log('Index of voted anecdote:', selected)
  }

  // Seuraavan anekdootin asettavan napin tapahtumankäsittelijä.
  const handleNext = () => {
    
    // Haetaan satunnaisluku ja tallennetaan se muuttujaan. 
    let randomNumber = getRandomNumber()
    
    // Haetaan sopivaa satunnaislukua kunnes sellainen on löytynyt.
    while (true) {

      // Jos arvottu satunnaisluku on sama kuin jo ruudulla näkyvä luku,
      // haetaan uusi satunnaisluku ja tulostetaan siitä ilmoitus konsoliin.
      if (randomNumber === selected) {
        randomNumber = getRandomNumber()
        console.log('Regenerated number.') 

      // Muussa tapauksessa tulostetaan konsoliin käytetty satunnaisluku 
      // ja asetetaan ruudulle uusi anekdootti setSelected-funktion avulla.
      // Päädytty haluttuun lopputulokseen; poistutaan silmukasta.
      } else {
        console.log('Random number:', randomNumber)
        setSelected(randomNumber)
        break
      }
    }
  }

  return (
    <div>
      <h1>Anecdote of the day:</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleVote}>Vote</button>
      <button onClick={handleNext}>Next anecdote</button>
      <h1>Most voted anecdote:</h1>
      <p>{anecdotes[mostVotesIndex]}</p>
      <p>has {mostVotes} votes</p>
    </div>
  )
}

export default App
