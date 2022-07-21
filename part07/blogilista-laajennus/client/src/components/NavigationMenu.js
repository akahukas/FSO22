// React-Bootstrap -komponentit.
import { Navbar, Container, Button, Nav } from 'react-bootstrap'

// Hookit.
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

// Reducerit.
import { deleteUser } from '../reducers/userReducer'
import {
  setSuccessNotification,
  clearSuccessNotification,
} from '../reducers/successNotificationReducer'

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
      dispatch(setSuccessNotification('Logged out successfully.'))
      setTimeout(() => {
        dispatch(clearSuccessNotification())
      }, 5000)
    } catch (exception) {
      console.log('An error occurred while trying to log out.')
    }
  }

  /* Tyyliasetuksia.
  const menuStyle = {
    backgroundColor: 'lightgrey'
  }*/

  const padding = {
    padding: 10,
  }

  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      bg="dark"
      variant="dark"
      style={{
        minWidth: '100%',
      }}
    >
      <Container style={{ display: 'flex', float: 'right' }}>
        <Navbar.Brand
          style={{
            color: 'white',
          }}
        >
          Blogs-application
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/">
                Blogs
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">
                Users
              </Link>
            </Nav.Link>
            <Nav.Item
              style={{ display: 'flex', float: 'right' }}
              bsPrefix="container"
              as="div"
            >
              <Navbar.Text
                style={{
                  width: '200px',
                  color: 'white',
                }}
              >
                Logged in as {name}.
              </Navbar.Text>
              <Button
                variant="primary"
                id="logoutButton"
                onClick={handleLogout}
                className="me-auto"
                style={{
                  width: '100px',
                }}
              >
                Logout
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationMenu
