// React-Bootstrap -komponentit.
import { Alert } from 'react-bootstrap'

// Hookit.
import { useSelector } from 'react-redux'

const SuccessNotification = () => {
  // Haetaan Redux-storen tilasta ilmoituksen viesti.
  const message = useSelector((state) => state.successNotification)

  if (message === null) {
    return null
  }

  return (
    <Alert key="success" variant="success">
      {message}
    </Alert>
  )
}

export default SuccessNotification
