// Hookit.
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

// Reducerit.
import { deleteUser } from '../reducers/userReducer'
import { setSuccessNotification, clearSuccessNotification } from '../reducers/successNotificationReducer'

const NavigationMenu = () => {
  // Hyödynnetään Redux-storeen lähetettävissä actioneissa.
  const dispatch = useDispatch()

  // Hyödynnetään liikuttaessa näkymästä toiseen.
  const navigate = useNavigate()

  // Haetaan localStorageen tallennettu käyttäjä.
  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
  const name = JSON.parse(loggedUserJSON).name

  // Käyttäjän uloskirjaamisesta vastuussa oleva tapahtumankäsittelijä.
  const handleLogout = (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem('loggedBlogAppUser')

      // Lähetetään Redux-storeen käyttäjän poistava action.
      dispatch(deleteUser())

      // Siirrytään takaisin alkusivulle, eli kirjautumisnäkymään.
      navigate('/')

      // Lähetetään Redux-storeen ilmoituksen asettava action ja
      // nollataan se alkuperäiseen tilaansa 5 sekunnin kuluttua.
      dispatch(setSuccessNotification(
        'Logged out successfully.'
      ))
      setTimeout(() => {
        dispatch(clearSuccessNotification())
      }, 5000)

    } catch (exception) {
      console.log('An error occurred while trying to log out.')
    }
  }

  // Tyyliasetuksia.
  const menuStyle = {
    backgroundColor: 'lightgrey'
  }

  const padding = {
    padding: 5
  }

  return (
    <div style={menuStyle}>
      <div style={padding}>
        <Link style={padding} to='/'>Blogs</Link>
        <Link style={padding} to='/users'>Users</Link>
      Logged in as {name}.{' '}
        <button id="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default NavigationMenu