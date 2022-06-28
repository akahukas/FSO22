import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    // Äänestyksen action creator.
    addVoteTo(state, action) {
      // Tallennetaan muuttujaan anekdootin tunniste 
      // ja haetaan tilasta tunnistetta vastaava anekdootti.
      const id = action.payload
      const anecdoteToVote = state.find(
        anecdote => anecdote.id === id
      )
      
      // Muokattava anekdootti, kopioidaan tilasta tiedot
      // ja kasvatetaan anekdootin äänimäärää yhdellä.
      const changedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      
      // Korvataan tilassa alkuperäinen anekdootti muokatulla,
      // säilytetään muut anekdootit ennallaan.
      return state.map(
        anecdote => anecdote.id === id ? changedAnecdote : anecdote
      )
    },
    // Uuden anekdootin luomisen action creator.
    addNewAnecdote(state, action) {
      // Luodaan uusi anekdoottiolio parametrina saaduista tiedoista.
      const newAnecdote = asObject(action.payload)
      
      // Palautetaan kopio alkuperäisestä tilasta, jonka perään
      // on liitetty actionin mukana lähetetty anekdoottiolio.
      return [ ...state, newAnecdote ]
    },
    // Anekdoottien järjestämisen action creator.
    sortAnecdotes(state, action) {
      // Palautetaan tila järjestettynä 
      // äänien mukaiseen laskevaan suuruusjärjestykseen.
      return (state.sort(
        (anecdote1, anecdote2) => anecdote2.votes - anecdote1.votes)
      )
    }
  }
})

export const { addVoteTo, addNewAnecdote, sortAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer