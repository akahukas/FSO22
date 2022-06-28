import { useSelector } from 'react-redux'

const Notification = () => {
  // Haetaan Redux-storen tilan kentästä ilmoituksen viesti.
  const notification = useSelector(state => state.notification)

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

export default Notification