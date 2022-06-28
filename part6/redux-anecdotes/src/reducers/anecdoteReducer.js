import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // Alkup. anekdootin muokatulla korvaava action creator.
    updateAnecdoteVotes(state, action) {
      // Tallennetaan muuttujaan muokattu anekdootti.
      const updatedAnecdote = action.payload
      
      // Korvataan tilassa alkuperäinen anekdootti muokatulla,
      // säilytetään muut anekdootit ennallaan.
      return state.map(
        anecdote => anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
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
  updateAnecdoteVotes,
  sortAnecdotes,
  appendAnecdote,
  setAnecdotes 
} = anecdoteSlice.actions

// Asynkroninen action anekdoottien alustamiseksi. 
export const initializeAnecdotes = () => {
  return async dispatch => {

    // Haetaan palvelimelle tallennetut anekdootit ja 
    // tallennetaan ne Redux-storen tilaan.
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))

    // Sortataan palvelimelta haetut anekdootit
    // äänimäärän perusteella sillä ne eivät
    // välttämättä ole palvelimella oikeassa järjestyksessä.
    dispatch(sortAnecdotes())
  }
}

// Asynkroninen action anekdootin anekdootin lisäämiseksi.
export const addNewAnecdote = content => {
  return async dispatch => {

    // Tallennetaan palvelimelle ja 
    // Redux-storen tilaan uusi anekdootti.
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

// Asynkroninen action anekdootin äänimäärän päivittämiseen.
export const addVoteTo = anecdote => {
  return async dispatch => {

    // Tallennetaan palvelimelle ja 
    // Redux-storen tilaan päivitetty anekdootti.
    const updatedAnecdote = await anecdoteService.updateOld(anecdote)
    dispatch(updateAnecdoteVotes(updatedAnecdote))
    
    // Lähetetöön Redux-storeen anekdootit järjestävä action.
    dispatch(sortAnecdotes())
  }
}

export default anecdoteSlice.reducer