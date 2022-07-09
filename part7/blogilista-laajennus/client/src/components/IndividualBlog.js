// Hookit.
import { useDispatch, useSelector } from 'react-redux'
import { useMatch, Navigate } from 'react-router-dom'
import { useField } from '../hooks'

// Komponentit.
import NavigationMenu from './NavigationMenu'
import SuccessNotification from './SuccessNotification'

// React-Bootstrap -komponentit.
import { Button, Form, Container, ListGroup } from 'react-bootstrap'

// Palvelut.
import blogService from '../services/blogs'

// Reducerit.
import {
  setSuccessNotification,
  clearSuccessNotification,
} from '../reducers/successNotificationReducer'
import { setBlogs } from '../reducers/blogReducer'

const IndividualBlog = () => {
  // Hyödynnetään Redux-storeen lähetettävissä actioneissa.
  const dispatch = useDispatch()

  // Asetetaan Redux-storen tilasta blogit muuttujaan.
  const blogs = useSelector((state) => state.blogs)

  // Määrittää parametrinä saatua id:tä vastaavan blogin.
  const blogById = (id) => blogs.find((b) => b.id === id)

  // Tallennetaan muuttujaan blogisivun id:tä vastaava blogi.
  const match = useMatch('/blogs/:id')
  const matchedBlog = match ? blogById(match.params.id) : null

  // Jos sivu päivitetään tai sille siirrytään suoraan,
  // siirretään käyttäjä aloitussivulle.
  if (!matchedBlog) {
    return (
      <div>
        <Navigate replace to="/" />
      </div>
    )
  }

  // Päivittää tykkäysten lukumäärän ruudulle tykkäysnapin painalluksen yhteydessä.
  const renderBlogs = async () => {
    const response = await blogService.getAll()

    // Lähetetään Redux-storeen blogit asettava action.
    dispatch(
      setBlogs(response.sort((blog1, blog2) => blog2.likes - blog1.likes))
    )
  }

  // Tykkäyksen lisäämisestä blogille vastaava tapahtumankäsittelijä.
  const handleLike = async (id, blogObject) => {
    await blogService.updateOld(id, blogObject)

    // Päivitetään tykkäykset.
    renderBlogs()

    // Lähetetään Redux-storeen ilmoituksen asettava action ja
    // nollataan se alkuperäiseen tilaansa 5 sekunnin kuluttua.
    dispatch(
      setSuccessNotification(
        `Added a like to blog ${blogObject.title} by ${blogObject.author}.`
      )
    )
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

  // Erotetaan syöttökentän nollausfunktio sen muista toiminnoista.
  const { reset: resetCommentValue, ...comment } = useField('text')

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Lisätään syöttökentän arvo blogin kommenttien perälle.
    const newComments = matchedBlog.comments.concat(comment.value)

    // Lähetetään muokattu blogiolio tietokantaan.
    await blogService.addComment(matchedBlog.id, {
      user: matchedBlog.user.id,
      likes: matchedBlog.likes,
      author: matchedBlog.author,
      title: matchedBlog.title,
      url: matchedBlog.url,
      comments: newComments,
    })

    // Tyhjennetään syöttökentän arvo.
    resetCommentValue()

    // Päivitetään tykkäykset.
    renderBlogs()

    // Lähetetään Redux-storeen ilmoituksen asettava action ja
    // nollataan se alkuperäiseen tilaansa 5 sekunnin kuluttua.
    dispatch(
      setSuccessNotification(
        `Added a comment to blog ${matchedBlog.title} by ${matchedBlog.author}.`
      )
    )
    setTimeout(() => {
      dispatch(clearSuccessNotification())
    }, 5000)
  }

  return (
    <div>
      <NavigationMenu />

      <SuccessNotification />

      <Container
        style={{
          color: 'white',
          padding: '10px',
        }}
      >
        <h2>
          {matchedBlog.title} by {matchedBlog.author}
        </h2>
        <div>
          Find at: <a href={matchedBlog.url}>{matchedBlog.url}</a>
        </div>
        <div>
          Likes: {matchedBlog.likes}{' '}
          <Button variant="secondary" id="likeButton" onClick={addLike}>
            like
          </Button>
        </div>
        <div>Added by {matchedBlog.user.name}</div>
      </Container>

      <Container>
        <h3
          style={{
            color: 'white',
          }}
        >
          Comments:
        </h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Container
              style={{
                display: 'flex',
                height: '30px',
                marginBottom: '20px',
              }}
            >
              <Form.Control {...comment} required size="sm" />
              <Button
                style={{ width: '200px' }}
                variant="primary"
                type="submit"
                className="mx-2"
                size="sm"
              >
                Add comment
              </Button>
            </Container>
          </Form.Group>
        </Form>

        <ListGroup>
          {matchedBlog.comments.map((comment) => (
            <ListGroup.Item
              variant="dark"
              key={matchedBlog.comments.indexOf(comment)}
            >
              - {comment}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    </div>
  )
}

export default IndividualBlog
