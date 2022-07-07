import { useSelector } from 'react-redux'

const SuccessNotification = () => {
  // Haetaan Redux-storen tilasta ilmoituksen viesti.
  const message = useSelector(state => state.successNotification)

  if (message === null) {
    return null
  }

  return <div className="successNotification">{message}</div>
}

export default SuccessNotification
