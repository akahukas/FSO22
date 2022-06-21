import { useState } from 'react'

const Blog = ({ blog, handleLike , checkCorrectUser, remove}) => {
  const [minimized, setMinimized] = useState(true)
  const [removeVisible, setRemoveVisible] = useState(false)

  const hideWhenMinimized = { display: minimized ? 'none' : ''}

  const showWhenCorrectUser = { display: removeVisible ? '' : 'none' }

  const toggleSize = () => {
    setMinimized(!minimized)

    if (checkCorrectUser(blog.id)) {
      setRemoveVisible(true)
    }
    else {
      setRemoveVisible(false)
    }
  }

  const blogStyle = {
    border: 'solid',
    borderWidth: 1,
    padding: 10,
    margin: 5,
  }

  const buttonStyle= {
    backgroundColor: 'Crimson'
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
      <div style={showWhenCorrectUser}>
        <button style={buttonStyle} onClick={() => remove(blog.id)}>Remove</button>
      </div>
    </div>
  </div>  
)}

export default Blog