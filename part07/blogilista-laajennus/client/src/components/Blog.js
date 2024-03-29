//import { useState } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  /*const [minimized, setMinimized] = useState(true)
  const [removeVisible, setRemoveVisible] = useState(false)

  // Tallennetaan muuttujiin blogin sisällön ja <remove>-painikkeen näkyvyys.
  const hideWhenMinimized = { display: minimized ? 'none' : '' }
  const showWhenCorrectUser = { display: removeVisible ? '' : 'none' }

  // Jos <view/hide>-painiketta painetaan,
  // muutetaan blogin sisällön näkyvyyttä.
  const toggleSize = () => {
    setMinimized(!minimized)

    // Tarkastetaan kuuluuko blogi kirjautuneelle käyttäjälle.
    // Jos kuuluu, asetetaan <remove>-painike näkyviin.
    if (checkCorrectUser(blog.id)) {
      setRemoveVisible(true)
    } else {
      setRemoveVisible(false)
    }
  }

  const blogStyle = {
    border: 'solid',
    borderWidth: 1,
    padding: 10,
    margin: 5,
  }

  const buttonStyle = {
    backgroundColor: 'Crimson',
  }

  const addLike = () => {
    const newLikes = blog.likes + 1

    handleLike(blog.id, {
      user: blog.user.id,
      likes: newLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    })
  }*/

  return (
    <tr key={blog.id} className="titleAndAuthor">
      <td>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </td>
      {/*<button id="viewButton" onClick={toggleSize}>
        {minimized ? 'view' : 'hide'}
      </button>
    </div>
    <div style={hideWhenMinimized} className="urlAndLikes">
      <p>{blog.url}</p>
      <p id="likes">
        likes {blog.likes}
        <button id="likeButton" onClick={addLike}>
          like
        </button>
      </p>
      <p>{blog.user.name}</p>
      <div style={showWhenCorrectUser}>
        <button
          id="removeButton"
          style={buttonStyle}
          onClick={() => remove(blog.id)}
        >
          Remove
        </button>
      </div>*/}
    </tr>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  checkCorrectUser: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
}

export default Blog
