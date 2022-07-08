// Hookit.
import { useState, useEffect } from 'react'

// Palvelut.
import userService from '../services/users'

// Komponentit.
import LoggedInElement from './LoggedInElement'

const UsersList = () => {
  // Tallennetaan käyttäjät tilaan.
  const [users, setUsers] = useState([])

  // Haetaan tietokannassa olevat käyttäjät, lajitellaan
  // ne luotujen blogien määrän mukaiseen laskevaan
  // suuruusjärjestykseen ja tallennetaan ne tilaan.
  useEffect(() => {
    async function getUsers() {
      const response = await userService.getAll()
      setUsers(response.data.sort((user1, user2) =>
        user2.blogs.length - user1.blogs.length))
    }
    getUsers()
  }, [])

  return (
    <div>
      <h1>Blogs-application</h1>

      <LoggedInElement />

      <div key='UsersList'>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersList
