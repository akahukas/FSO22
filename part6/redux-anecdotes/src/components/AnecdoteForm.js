import { addNewAnecdote } from '../reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = (event) => {
      event.preventDefault()
      
      // Tallennetaan muuttujaan uuden anekdootin 
      // teksti ja tyhjennetään syöttökenttä.
      const content = event.target.anecdote.value
      event.target.anecdote.value = ''
  
      // Lähetetään Redux-storeen uuden 
      // anekdootin lisäävä action.
      dispatch(addNewAnecdote(content))
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