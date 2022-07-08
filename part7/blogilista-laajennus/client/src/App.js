// Hyödynnettävät hookit.
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Hyödynnettävät palvelut.
import blogService from './services/blogs'
import loginService from './services/login'

// Hyödynnettävät komponentit.
import Blog from './components/Blog'
import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import NavigationMenu from './components/NavigationMenu'

// Hyödynnettävät reducerit.
import { setSuccessNotification, clearSuccessNotification } from './reducers/successNotificationReducer'
import { setErrorNotification, clearErrorNotification } from './reducers/errorNotificationReducer'
import { initializeBlogs, setBlogs, appendBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Käytetään actionien lähetyksessä Redux-storeen.
  const dispatch = useDispatch()

  // Alustetaan blogit avauksen yhteydessä.
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  // Määritetään käyttäjä muuttujaan Redux-storen tilasta.
  const user = useSelector(state => state.user)

  // Määritetään blogit muuttujaan Redux-storen tilasta.
  const blogs = useSelector(state => state.blogs)

  // Viite BlogForm-komponenttiin.
  const blogFormRef = useRef()

  // Alustetaan blogit ruudulle.
  useEffect(() => {
    renderBlogs()
  }, [])

  // Alustetaan käyttäjän istunto, jos
  // käyttäjä löytyy edelleen selaimen localStoragesta.
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      // Lähetetään Redux-storeen käyttäjän asettava action.
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  // Vastaa blogien päivittämisestä ruudulle lajiteltuna
  // blogien tykkäysten mukaiseen laskevaan järjestykseen.
  const renderBlogs = async () => {
    const response = await blogService.getAll()

    // Lähetetään Redux-storeen blogit asettava action.
    dispatch(setBlogs(response.sort((blog1, blog2) => blog2.likes - blog1.likes)))
  }

  // Uuden blogin lisäämisestä huolehtiva tapahtumankäsittelijä.
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.createNew(blogObject).then((returnedBlog) => {
      renderBlogs()

      // Lähetetään Redux-storeen blogin lisäävä action.
      dispatch(appendBlog(returnedBlog))
    })

    renderBlogs()

    // Lähetetään Redux-storeen ilmoituksen asettava action ja
    // nollataan se alkuperäiseen tilaansa 5 sekunnin kuluttua.
    dispatch(setSuccessNotification(
      `Added a new blog ${blogObject.title} by ${blogObject.author}.`
    ))
    setTimeout(() => {
      dispatch(clearSuccessNotification())
    }, 5000)
  }

  // Tykkäyksen lisäämisestä blogille vastaava tapahtumankäsittelijä.
  const addLike = async (id, blogObject) => {
    await blogService.updateOld(id, blogObject)

    renderBlogs()

    // Lähetetään Redux-storeen ilmoituksen asettava action ja
    // nollataan se alkuperäiseen tilaansa 5 sekunnin kuluttua.
    dispatch(setSuccessNotification(
      `Added a like to blog ${blogObject.title} by ${blogObject.author}.`
    ))
    setTimeout(() => {
      dispatch(clearSuccessNotification())
    }, 5000)
  }

  // Tarkastaa kuuluuko parametrina saatua blogin id:tä vastaava blogi
  // kirjautuneen käyttäjän luomiin blogeihin. Palauttaa <true> jos
  // kuuluu ja <false> jos ei kuulu.
  const isBlogCreatedByLoggedUser = (blogId) => {
    const currentBlog = blogs.find(({ id }) => id === blogId)

    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    const loggedUser = JSON.parse(loggedUserJSON)

    if (currentBlog.user.username === loggedUser.username) {
      return true
    }
    return false
  }

  // Blogin poistamisesta vastuussa oleva tapahtumankäsittelijä.
  const removeBlog = async (blogId) => {
    const blog = blogs.find(({ id }) => id === blogId)

    const confirmMessage = `Remove blog ${blog.title} by ${blog.author}?`

    if (window.confirm(confirmMessage)) {
      await blogService.remove(blogId)

      renderBlogs()

      // Lähetetään Redux-storeen ilmoituksen asettava action ja
      // nollataan se alkuperäiseen tilaansa 5 sekunnin kuluttua.
      dispatch(setSuccessNotification(
        `Blog ${blog.title} by ${blog.author} removed successfully.`
      ))
      setTimeout(() => {
        dispatch(clearSuccessNotification())
      }, 5000)
    }
  }

  // Tapahtumankäsittelijä, joka huolehtii käyttäjän sisäänkirjautumisesta.
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)

      // Lähetetään Redux-storeen käyttäjän asettava action.
      dispatch(setUser(user))
      setUsername('')
      setPassword('')

      // Lähetetään Redux-storeen ilmoituksen asettava action ja
      // nollataan se alkuperäiseen tilaansa 5 sekunnin kuluttua.
      dispatch(setSuccessNotification('Logged in successfully.'))
      setTimeout(() => {
        dispatch(clearSuccessNotification())
      }, 5000)
    } catch (exception) {
      // Lähetetään Redux-storeen virheilmoituksen asettava action ja
      // nollataan se alkuperäiseen tilaansa 5 sekunnin kuluttua.
      dispatch(setErrorNotification('Wrong username or password.'))
      setTimeout(() => {
        dispatch(clearErrorNotification())
      }, 5000)
    }
  }

  // Palauttaa kutsuttaessa kirjautumislomake-komponentin.
  const loginForm = () => (
    <LoginForm
      handleSubmit={handleLogin}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
    />
  )

  // Palauttaa kutsuttaessa bloginluomis-komponentin.
  const blogForm = () => (
    <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  // Palauttaa kutsuttaessa komponentin, joka sisältää listan tietokannassa olevista blogeista.
  const bloglistElement = () => (
    <div id="blogList">
      <h2>Blogs in database:</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={addLike}
          checkCorrectUser={isBlogCreatedByLoggedUser}
          remove={removeBlog}
        />
      ))}
    </div>
  )

  return (
    <div>
      {user !== null && <NavigationMenu />}

      <h1>Blogs-application</h1>
      <SuccessNotification />
      <ErrorNotification />

      {user === null && loginForm()}
      {user !== null && blogForm()}
      {user !== null && bloglistElement()}
    </div>
  )
}

export default App
