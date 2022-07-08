// Hookit.
import { useSelector } from 'react-redux'
import { useMatch, Navigate } from 'react-router-dom'

// Komponentit.
import NavigationMenu from './NavigationMenu'

const User = () => {
  // Haetaan muuttujaan käyttäjät Redux-storen tilasta.
  const users = useSelector(state => state.users)

  // Määrittää parametrina saatua id:tä vastaavan käyttäjän.
  const userById = (id) => users.find(u => u.id === id)

  // Sivun id:tä vastaava käyttäjä.
  const match = useMatch('/users/:id')
  const matchedUser = match
    ? userById(match.params.id)
    : null

  // Jos sivu päivitetään tai sille siirrytään suoraan,
  // siirretään käyttäjä kaikki käyttäjät listaavalle sivulle.
  if (!matchedUser) {
    return (
      <div>
        <Navigate replace to='/users' />
      </div>
    )
  }

  return (
    <div>
      <NavigationMenu />

      <h1>Blogs-application</h1>

      <div>
        <h2>{matchedUser.name}</h2>
        <h3>added blogs</h3>
        <ul>
          {matchedUser.blogs.map((blog) => (
            <li key={blog.id}>
              {blog.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default User