// React-Bootstrap -komponentit.
import { Form, Button, FloatingLabel } from 'react-bootstrap'

import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  return (
    <div>
      <h1
        style={{
          color: 'white',
        }}
      >
        Blogs-application
      </h1>
      <h2
        style={{
          color: 'white',
        }}
      >
        Log in to application:
      </h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <FloatingLabel label="Username" className="mb-3">
            <Form.Control
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              required
              placeholder="exampleUsername"
            />
          </FloatingLabel>
          <FloatingLabel label="Password" className="mb-3">
            <Form.Control
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              required
              placeholder="examplePassword"
            />
          </FloatingLabel>
          <Button variant="primary" id="loginButton" type="submit">
            Login
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
}

export default LoginForm
