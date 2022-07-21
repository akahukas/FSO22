import { setFilter } from '../reducers/filterReducer'
import { connect } from 'react-redux'

const Filter = (props) => {
  
  // Syöttökentän arvon muutoksen tapahtumankäsittelijä.
  const handleChange = (event) => {
    // Lähetetään Redux-storeen suodattimen asettava action.
    props.setFilter(event.target.value)
  }
  
  // Elementin tyyliasetukset.
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      Filter <input onChange={handleChange} />
    </div>
  )
}

// Määritellään action propsien kautta välitettäväksi.
const mapDispatchToProps = {
  setFilter,
}

// Määritellään yhdistetyksi komponentiksi.
const ConnectedFilter = connect(
  null,
  mapDispatchToProps
)(Filter)

export default ConnectedFilter