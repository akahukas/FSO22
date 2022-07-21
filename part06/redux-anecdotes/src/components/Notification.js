import { connect } from 'react-redux'

const Notification = (props) => {
  // Haetaan propseista ilmoituksen viesti.
  const notification = props.notification

  // Jos ilmoitus on tyhjä, ei palauteta ilmoituselementtiä.
  if(notification === null) {
    return null
  }

  // Muussa tapauksessa renderöidään ruudulle 
  // ilmoituselementti tilasta haetulla viestillä.
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

// Määritellään Redux-storen tilasta
// propsiksi ilmoituksen tila.
const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

// Määritellään yhdistetyksi komponentiksi.
const ConnectedNotification = connect(mapStateToProps)(Notification)
export default ConnectedNotification