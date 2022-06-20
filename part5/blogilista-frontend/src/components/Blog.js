import { useState } from 'react'

const Blog = ({blog}) => {
  const [minimized, setMinimized] = useState(true)

  const hideWhenMinimized = { display: minimized ? 'none' : ''}

  const toggleSize = () => {
    setMinimized(!minimized)
  }

  const blogStyle = {
    border: 'solid',
    borderWidth: 1,
    padding: 10,
    margin: 5,
  }

  return (
  <div style={blogStyle}>
    <div>
      {blog.title} {blog.author} <button onClick={toggleSize}>{minimized ? 'view' : 'hide'}</button>
    </div>
    <div style={hideWhenMinimized}>
      <p>{blog.url}</p>
      likes {blog.likes} <button>like</button>
      <p>{blog.user.name}</p>
    </div>
    
  </div>  
)}

export default Blog