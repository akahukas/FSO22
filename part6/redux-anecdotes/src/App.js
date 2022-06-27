import { addNewAnecdote, addVoteTo, sortAnecdotes } from './reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const vote = (id) => {
    // Lähetetään Redux-storeen äänen antava action.
    dispatch(addVoteTo(id))

    // Lähetetöön Redux-storeen anekdootit järjestävä action.
    dispatch(sortAnecdotes())
  }

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
      <h2>Anecdotes:</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>Create new:</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='anecdote'/></div>
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default App