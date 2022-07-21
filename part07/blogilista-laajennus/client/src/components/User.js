// Hookit.
import { useSelector } from 'react-redux'
import { useMatch, Navigate } from 'react-router-dom'

// Komponentit.
import NavigationMenu from './NavigationMenu'

// React-Bootstrap -komponentit.
import { Container, ListGroup } from 'react-bootstrap'

const User = () => {
  // Haetaan muuttujaan käyttäjät Redux-storen tilasta.
  const users = useSelector((state) => state.users)

  // Määrittää parametrina saatua id:tä vastaavan käyttäjän.
  const userById = (id) => users.find((u) => u.id === id)

  // Sivun id:tä vastaava käyttäjä.
  const match = useMatch('/users/:id')
  const matchedUser = match ? userById(match.params.id) : null

  // Jos sivu päivitetään tai sille siirrytään suoraan,
  // siirretään käyttäjä kaikki käyttäjät listaavalle sivulle.
  if (!matchedUser) {
    return (
      <div>
        <Navigate replace to="/users" />
      </div>
    )
  }

  return (
    <div>
      <NavigationMenu />

      <Container>
        <h2
          style={{
            color: 'white',
            padding: 10,
          }}
        >
          {matchedUser.name} added following blogs:
        </h2>
        <ListGroup>
          {matchedUser.blogs.map((blog) => (
            <ListGroup.Item variant="dark" key={blog.id}>
              - {blog.title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    </div>
  )
}

export default User
