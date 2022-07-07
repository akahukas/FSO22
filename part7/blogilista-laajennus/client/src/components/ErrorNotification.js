import { useSelector } from 'react-redux'

const ErrorNotification = () => {
  // Haetaan Redux-storen tilasta ilmoituksen viesti.
  const message = useSelector(state => state.errorNotification)

  if (message === null) {
    return null
  }

  return <div className="errorNotification">{message}</div>
}

export default ErrorNotification
