import axios from 'axios'
const originalUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    const request = axios.get(originalUrl)
    return request.then(response => response.data)
}

const createNew = newObject => {
    const request = axios.post(originalUrl, newObject)
    return request.then(response => response.data)
}

const deleteOld = id => {
    const request = axios.delete(`${originalUrl}/${id}`)
    return request.then(response => response.data)
}

const updateOld = (id, newObject) => {
  const request = axios.put(`${originalUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, createNew, deleteOld, updateOld}