// Hookit.
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Komponentit.
import LoggedInElement from './LoggedInElement'
import { Link } from 'react-router-dom'

// Reducerit.
import { initializeUsers } from '../reducers/usersReducer'

const UsersList = () => {
  // Hyödynnetään Redux-storeen lähetettävissä actioneissa.
  const dispatch = useDispatch()

  // Alustetaan tietokannassa olevat käyttäjät
  // Redux-storen tilaan.
  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  // Haetaan muuttujaan käyttäjät Redux-storen tilasta.
  const users = useSelector(state => state.users)

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
                <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
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
