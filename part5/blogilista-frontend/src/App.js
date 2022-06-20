import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      console.log('Wrong username or password')
    }
  }

  const handleLogout = (event) => {
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
          username
            <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
          password
            <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )

  const bloglistElement = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    const name = JSON.parse(loggedUserJSON).name
    
    return <div>
      <p>Logged in as {name}</p>
      <button onClick={handleLogout}>logout</button>

      <h2>Blogs in database:</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  }
  
  return (
    <div>
      <h1>Blogs-application</h1>
      
      {user === null
        ? loginForm()
        : bloglistElement()
      }

    </div>
  )
}

export default App
