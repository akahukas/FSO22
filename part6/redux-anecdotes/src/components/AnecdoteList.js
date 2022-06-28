import { addVoteTo, sortAnecdotes } from '../reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()
  
  const vote = (id) => {
    // Lähetetään Redux-storeen äänen antava action.
    dispatch(addVoteTo(id))

    // Lähetetöön Redux-storeen anekdootit järjestävä action.
    dispatch(sortAnecdotes())
  }

  return (
    <div>
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
    </div>
  ) 
}

export default AnecdoteList