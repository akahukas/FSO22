// React-Bootstrap -komponentit.
import { Form, Button, FloatingLabel } from 'react-bootstrap'

// Hookit.
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // Tapahtumankäsittelijä <Create>-napin painallukselle.
  const addBlog = (event) => {
    event.preventDefault()

    // Välitetään blogin tiedot parametrina saadulle
    // tapahtumankäsittelijälle.
    createBlog({
      title: title,
      author: author,
      url: url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2
        style={{
          color: 'white',
        }}
      >
        Create new blog:
      </h2>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <FloatingLabel label="Title" className="mb-3">
            <Form.Control
              id="title"
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
              placeholder="Example title"
              required
            />
          </FloatingLabel>
          <FloatingLabel label="Author" className="mb-3">
            <Form.Control
              id="author"
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
              placeholder="Example author"
              required
            />
          </FloatingLabel>
          <FloatingLabel label="Url" className="mb-3">
            <Form.Control
              id="url"
              type="url"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
              placeholder="Example Url"
              required
            />
          </FloatingLabel>
          <Button id="createButton" type="submit">
            Create
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default BlogForm
