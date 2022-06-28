import axios from 'axios'

const originalUrl = 'http://localhost:3001/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (content) => {
  return {
    content,
    id: getId(),
    votes: 0
  }
}

const getAll = async () => {
  const response = await axios.get(originalUrl)
  return response.data
}

const createNew = async (content) => {
  const anecdoteObject = asObject(content)
  const response = await axios.post(originalUrl, anecdoteObject)

  return response.data
}

export default { 
  getAll,
  createNew,
}