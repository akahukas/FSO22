import { createSlice } from '@reduxjs/toolkit'

// Ilmoitus on aluksi tyhjä, jolloin se ei renderöidy ruudulle.
const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Äänestysilmoituksen action creator.
    setVoteNotification(state, action) {
      const anecdoteName = action.payload
      state = `You voted '${anecdoteName}'.`

      return state
    },
    // Lisäysilmoituksen action creator.
    setAddNotification(state, action) {
      const anecdoteName = action.payload
      state = `You added '${anecdoteName}' to the list of Anecdotes.`

      return state
    },
    // Ilmoituksen tyhjennyksen action creator.
    clearNotification(state, action) {
      state = null

      return state
    }
  }
})

export const { 
  setVoteNotification, 
  setAddNotification, 
  clearNotification } = notificationSlice.actions
export default notificationSlice.reducer