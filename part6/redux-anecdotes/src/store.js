import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './reducers/anecdoteReducer'

export const store = configureStore({
  reducer: {
      anecdotes: anecdoteReducer
  }
})