import { addNewAnecdote } from '../reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'
import { setAddNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    
    // Tallennetaan muuttujaan uuden anekdootin 
    // teksti ja tyhjennetään syöttökenttä.
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    // Lähetetään Redux-storeen uuden 
    // anekdootin lisäävä asynkroninen action.
    dispatch(addNewAnecdote(content))

    // Lähetetään Redux-storeen ilmoituksen asettava action
    // ja tyhjennetään se actionin avulla 5 sekunnin kuluttua.
    dispatch(setAddNotification(content))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  return (
    <div>
      <h2>Create new:</h2>
      <form onSubmit={addAnecdote}>
      <div><input name='anecdote'/></div>
      <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm