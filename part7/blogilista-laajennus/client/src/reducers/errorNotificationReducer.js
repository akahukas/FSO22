import { createSlice } from '@reduxjs/toolkit'

// Ilmoitus on alkutilassaan tyhjä, jolloin se ei piirry ruudulle.
const initialState = null

const errorNotificationSlice = createSlice({
  name: 'errorNotification',
  initialState,
  reducers: {
    // Ilmoituksen asettamisen action creator.
    setErrorNotification(state, action) {
      state = action.payload

      return state
    },
    // Ilmoituksen nollaamisen action creator.
    clearErrorNotification(state) {
      state = null

      return state
    },
  },
})

export const { setErrorNotification, clearErrorNotification } =
  errorNotificationSlice.actions

export default errorNotificationSlice.reducer
