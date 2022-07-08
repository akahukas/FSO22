// Hookit.
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// Reducerit.
import { deleteUser } from '../reducers/userReducer'
import { setSuccessNotification, clearSuccessNotification } from '../reducers/successNotificationReducer'

const LoggedInElement = () => {
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

  return (
    <div>
      <p>Logged in as {name}.</p>
      <button id="logoutButton" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default LoggedInElement