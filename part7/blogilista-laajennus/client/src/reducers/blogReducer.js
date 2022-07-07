import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    // Blogien järjestämisen action creator.
    sortBlogs(state) {
      // Palautetaan tila järjestettynä tykkäysten
      // määrän mukaiseen laskevaan suuruusjärjestykseen.
      return state.sort(
        ((blog1, blog2) => blog2.likes - blog1.likes)
      )
    },
    // Yhden blogin lisäämisen action creator.
    appendBlog(state, action) {
      // Lisätään uusi blogi Redux-storen tilan perään.
      state.push(action.payload)
    },
    // Anekdoottien korvaamisen/asettamisen action creator.
    setBlogs(state, action) {
      return action.payload
    }
  }
})

export const {
  sortBlogs,
  appendBlog,
  setBlogs,
} = blogSlice.actions

// Asynkroninen action anekdoottien alustamiseksi.
export const initializeBlogs = () => {
  return async dispatch => {

    // Haetaan palvelimelle tallennetut blogit
    // ja tallennetaan ne Redux-storen tilaan.
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))

    // Sortataan haetut blogit, sillä ne eivät
    // välttämättä ole palvelimella oikeassa järjestyksessä.
    dispatch(sortBlogs())
  }
}

export default blogSlice.reducer