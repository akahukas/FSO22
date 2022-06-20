import axios from 'axios'
const originalUrl = '/api/login'

const login = async credentials => {
    const response = await axios.post(originalUrl, credentials)
    return response.data
}

export default { login }
