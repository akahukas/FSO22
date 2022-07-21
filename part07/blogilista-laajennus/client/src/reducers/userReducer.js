import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    // Käyttäjän asettava action creator.
    setUser(state, action) {
      state = action.payload

      return state
    },
    // Käyttäjän poistava action creator.
    deleteUser(state) {
      state = null

      return state
    },
  },
})

export const { setUser, deleteUser } = userSlice.actions

export default userSlice.reducer
