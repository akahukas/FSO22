// Hookit.
import { useDispatch, useSelector } from 'react-redux'
import { useMatch, Navigate } from 'react-router-dom'

// Komponentit.
import NavigationMenu from './NavigationMenu'
import SuccessNotification from './SuccessNotification'

// Palvelut.
import blogService from '../services/blogs'

// Reducerit.
import { setSuccessNotification, clearSuccessNotification } from '../reducers/successNotificationReducer'
import { setBlogs } from '../reducers/blogReducer'

const IndividualBlog = () => {
  // Hyödynnetään Redux-storeen lähetettävissä actioneissa.
  const dispatch = useDispatch()

  // Asetetaan Redux-storen tilasta blogit muuttujaan.
  const blogs = useSelector(state => state.blogs)

  // Määrittää parametrinä saatua id:tä vastaavan blogin.
  const blogById = (id) => blogs.find(b => b.id === id)

  // Tallennetaan muuttujaan blogisivun id:tä vastaava blogi.
  const match = useMatch('/blogs/:id')
  const matchedBlog = match
    ? blogById(match.params.id)
    : null

  // Jos sivu päivitetään tai sille siirrytään suoraan,
  // siirretään käyttäjä aloitussivulle.
  if (!matchedBlog) {
    return (
      <div>
        <Navigate replace to='/' />
      </div>
    )
  }

  // Päivittää tykkäysten lukumäärän ruudulle tykkäysnapin painalluksen yhteydessä.
  const renderBlogs = async () => {
    const response = await blogService.getAll()

    // Lähetetään Redux-storeen blogit asettava action.
    dispatch(setBlogs(response.sort((blog1, blog2) => blog2.likes - blog1.likes)))
  }

  // Tykkäyksen lisäämisestä blogille vastaava tapahtumankäsittelijä.
  const handleLike = async (id, blogObject) => {
    await blogService.updateOld(id, blogObject)

    // Päivitetään tykkäykset.
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

  // Luo uuden blogiolion päivitetyllä tykkäysten lukumäärällä.
  const addLike = () => {
    const newLikes = matchedBlog.likes + 1

    handleLike(matchedBlog.id, {
      user: matchedBlog.user.id,
      likes: newLikes,
      author: matchedBlog.author,
      title: matchedBlog.title,
      url: matchedBlog.url,
    })
  }

  return (
    <div>
      <NavigationMenu />

      <h1>Blogs-application</h1>
      <SuccessNotification />

      <div>
        <h2>{matchedBlog.title} by {matchedBlog.author}</h2>
        <div>
          Find at: <a href={matchedBlog.url}>{matchedBlog.url}</a>
        </div>
        <div>
          Likes: {matchedBlog.likes} {' '}
          <button id="likeButton" onClick={addLike}>
            like
          </button>
        </div>
        <div>
          Added by {matchedBlog.user.name}
        </div>
      </div>

      <div>
        <h3>Comments:</h3>
        <ul>
          {matchedBlog.comments.map((comment) => (
            <li key={matchedBlog.comments.indexOf(comment)}>
              {comment}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default IndividualBlog
