import { createSlice } from '@reduxjs/toolkit'

// Suodatin on aluksi ja oletuksena tyhjä.
const initialState = ''

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // Suodattimen asettamisen action creator.
    setFilter(state, action) {
      state = action.payload

      return state
    }
  }
})

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer