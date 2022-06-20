import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
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

  const addLike = () => {

    const newLikes = blog.likes + 1

    handleLike(blog.id, {
      user: blog.user.id,
      likes: newLikes,
      author: blog.user.name,
      title: blog.title,
      url: blog.url
    })
  }

  return (
  <div style={blogStyle}>
    <div>
      {blog.title} {blog.author} <button onClick={toggleSize}>{minimized ? 'view' : 'hide'}</button>
    </div>
    <div style={hideWhenMinimized}>
      <p>{blog.url}</p>
      likes {blog.likes} <button onClick={addLike}>like</button>
      <p>{blog.user.name}</p>
    </div>
    
  </div>  
)}

export default Blog