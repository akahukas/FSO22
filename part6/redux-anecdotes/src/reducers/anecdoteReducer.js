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
      // Lisätään uusi anekdootti Redux-storen tilan perään.
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

// Asynkroninen action anekdootin anekdootin lisäämiseksi.
export const addNewAnecdote = content => {
  return async dispatch => {
    // Tallennetaan palvelimelle uusi anekdootti.
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export default anecdoteSlice.reducer