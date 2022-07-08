// Hookit.
import { useSelector } from 'react-redux'
import { useMatch } from 'react-router-dom'

// Komponentit.
import LoggedInElement from './LoggedInElement'

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

  // Jos siirrytään suoraan käyttäjän sivulle,
  // piirretään näytölle selitys tapahtuneesta.
  if (!matchedUser) {
    return (
      <div>
        <h1>Blogs-application</h1>
        <LoggedInElement />

        <br />

        <p><strong>
          Please return to the previous page and open
          this user-view in the same tab.
          Thank you.
        </strong></p>
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs-application</h1>

      <LoggedInElement />

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