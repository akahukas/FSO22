// Hookit.
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Komponentit.
import NavigationMenu from './NavigationMenu'
import { Link } from 'react-router-dom'

// React-Bootstrap -komponentit.
import { Container, Table } from 'react-bootstrap'

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
  const users = useSelector((state) => state.users)

  return (
    <div>
      <NavigationMenu />

      <Container key="UsersList">
        <h2
          style={{
            color: 'white',
            padding: '10px',
          }}
        >
          Users
        </h2>
        <Table striped bordered variant="dark">
          <thead>
            <tr>
              <th>Name</th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  )
}

export default UsersList
