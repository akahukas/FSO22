import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'

import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    renderBlogs()  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const renderBlogs = async () => {
    const response = await blogService.getAll()

    setBlogs(response.sort((blog1, blog2) => blog2.likes - blog1.likes))
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .createNew(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })

    renderBlogs()

    setSuccessMessage(`Added a new blog ${blogObject.title} by ${blogObject.author}.`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const addLike = async (id, blogObject) => {

    await blogService.updateOld(id, blogObject)

    renderBlogs()

    setSuccessMessage(`Added a like to blog ${blogObject.title} by ${blogObject.author}.`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const isBlogCreatedByLoggedUser = (blogId) => {
    const currentBlog = blogs.find(({ id }) => id === blogId)

    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    const loggedUser = JSON.parse(loggedUserJSON)

    if (currentBlog.user.username === loggedUser.username) {
      return true
    }
    return false
  }

  const removeBlog = async (blogId) => {
    const blog = blogs.find(({ id }) => id === blogId)
    
    const confirmMessage = `Remove blog ${blog.title} by ${blog.author}?`

    if (window.confirm(confirmMessage)) {
      await blogService.remove(blogId)

      renderBlogs()

      setSuccessMessage(`Blog ${blog.title} by ${blog.author} removed successfully.`)
      setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
    }
  } 

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setSuccessMessage('Logged in successfully.')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    catch (exception) {
      setErrorMessage('Wrong username or password.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem('loggedBlogAppUser')
    }
    catch (exception) {
      console.log('An error occurred while trying to log out.')
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application:</h2>
      <form onSubmit={handleLogin}>
        <div>
          Username
            <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
          Password
            <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
  
  const loggedInElement = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    const name = JSON.parse(loggedUserJSON).name

    return <div>
      <p>Logged in as {name}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  }

  const blogForm = () => (
    <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const bloglistElement = () => (
    <div>
      <h2>Blogs in database:</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={addLike} 
              checkCorrectUser={isBlogCreatedByLoggedUser} remove={removeBlog}
        />
      )}
    </div>
  )

  return (
    <div>
      <h1>Blogs-application</h1>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />

      {user === null && loginForm()}
      {user !== null && loggedInElement()}
      {user !== null && blogForm()}
      {user !== null && bloglistElement()}
      
      

      

    </div>
  )
}

export default App
