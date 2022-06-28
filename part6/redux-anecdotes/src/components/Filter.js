import { setFilter } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const Filter = () => {
  const dispatch = useDispatch()
  
  // Syöttökentän arvon muutoksen tapahtumankäsittelijä.
  const handleChange = (event) => {
    // Lähetetään Redux-storeen suodattimen asettava action.
    dispatch(setFilter(event.target.value))
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

export default Filter