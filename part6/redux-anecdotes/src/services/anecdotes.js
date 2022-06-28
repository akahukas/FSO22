import axios from 'axios'

const originalUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(originalUrl)
  return response.data
}

export default { getAll }