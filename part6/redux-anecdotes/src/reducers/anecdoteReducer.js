import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
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
      // Palautetaan kopio alkuperäisestä tilasta, jonka perään
      // on liitetty actionin mukana lähetetty anekdoottiolio.
      return [ ...state, action.payload ]
    },
    // Anekdoottien järjestämisen action creator.
    sortAnecdotes(state, action) {
      // Palautetaan tila järjestettynä 
      // äänien mukaiseen laskevaan suuruusjärjestykseen.
      return (state.sort(
        (anecdote1, anecdote2) => anecdote2.votes - anecdote1.votes)
      )
    },
    // Anekdootin lisäämisen action creator.
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    // Anekdoottien korvaamisen action creator.
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { 
  addVoteTo, 
  addNewAnecdote, 
  sortAnecdotes,
  appendAnecdote,
  setAnecdotes 
} = anecdoteSlice.actions

// Asynkroninen action anekdoottien alustamiseksi. 
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export default anecdoteSlice.reducer