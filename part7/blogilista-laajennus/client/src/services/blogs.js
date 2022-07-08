import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

// Route kaikkien blogien noutamiseksi tietokannasta.
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// Route uuden blogin luomiseen ja tietokantaan tallentamiseen.
const createNew = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)

  return response.data
}

// Route vanhan jo tietokannassa olevan blogin tietojen päivittämiseen.
const updateOld = async (id, newBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, newBlog)
  return response.data
}

// Route jo tietokannassa olevan blogin poistamiseksi tietokannasta.
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)

  return response.data
}

// Route kommentin lisäämiseksi ja tallentamiseksi jo tietokannassa olevaan blogiin.
const addComment = async (id, newBlog) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, newBlog)

  return response.data
}

export default { setToken, getAll, createNew, updateOld, remove, addComment }
