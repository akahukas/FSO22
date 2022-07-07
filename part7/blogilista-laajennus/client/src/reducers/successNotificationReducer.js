import { createSlice } from '@reduxjs/toolkit'

// Ilmoitus on alkutilassaan tyhjä, jolloin se ei piirry ruudulle.
const initialState = null

const successNotificationSlice = createSlice({
  name: 'successNotification',
  initialState,
  reducers: {
    // Ilmoituksen asettamisen action creator.
    setSuccessNotification(state, action) {
      state = action.payload

      return state
    },
    // Ilmoituksen nollaamisen action creator.
    clearSuccessNotification(state) {
      state = null

      return state
    }
  }
})

export const {
  setSuccessNotification,
  clearSuccessNotification,
} = successNotificationSlice.actions

export default successNotificationSlice.reducer