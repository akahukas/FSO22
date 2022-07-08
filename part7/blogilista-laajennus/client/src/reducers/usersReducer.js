import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    // Käyttäjien järjestämisen action creator.
    sortUsers(state) {
      // Palautetaan tila järjestettynä käyttäjien blogien
      // lukumäärän mukaiseen laskevaan suuruusjärjestykseen.
      return state.sort((user1, user2) =>
        user2.blogs.length - user1.blogs.length)
    },
    // Käyttäjien asettamisen/korvaamisen action creator.
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const {
  sortUsers,
  setUsers,
} = usersSlice.actions

// Asynkroninen action käyttäjien alustamiseksi.
export const initializeUsers = () => {
  return async dispatch => {

    // Haetaan palvelimelle tallennetut käyttäjät
    // ja tallennetaan ne Redux-storen tilaan.
    const response = await userService.getAll()
    dispatch(setUsers(response.data))

    // Sortataan haetut käyttäjät, sillä ne eivät
    // välttämättä ole palvelimella oikeassa järjestyksessä.
    dispatch(sortUsers())
  }
}

export default usersSlice.reducer