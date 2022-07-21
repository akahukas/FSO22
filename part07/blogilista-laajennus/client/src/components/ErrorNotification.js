// React-Bootstrap -komponentit.
import { Alert } from 'react-bootstrap'

// Hookit.
import { useSelector } from 'react-redux'

const ErrorNotification = () => {
  // Haetaan Redux-storen tilasta ilmoituksen viesti.
  const message = useSelector((state) => state.errorNotification)

  if (message === null) {
    return null
  }

  return (
    <Alert key="danger" variant="danger">
      {message}
    </Alert>
  )
}

export default ErrorNotification
