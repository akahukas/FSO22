import axios from 'axios'
const baseUrl = '/api/users'

// Route kaikkien käyttäjien noutamiseksi tietokannasta.
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response
}

export default { getAll }
