import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: title,
      author: author,
      user: user._id,
      url: url
    }

    blogService
      .createNew(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
      })
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
    }
    catch (exception) {
      console.log('Wrong username or password')
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

      {blogForm()}

      <h2>Blogs in database:</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  }

  const blogForm = () => (
    <div>
      <h2>Create new blog:</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
            <input
            type='text'
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
            />
        </div>
        <div>
          Author:
            <input
            type='text'
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
            />
        </div>
        <div>
          Url:
            <input
            type='url'
            value={url}
            name='Url'
            onChange={({ target }) => setUrl(target.value)}
            />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )

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
