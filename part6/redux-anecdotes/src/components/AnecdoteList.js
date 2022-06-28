import { addVoteTo, sortAnecdotes } from '../reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'
import { setVoteNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  // Suodatetaan ruudulle renderöitävät anekdootit Redux-storen
  // filter-kentän avulla. Jos suodatin on tyhjä, renderöidään kaikki anekdootit.
  const anecdotes = useSelector(state => {
    return state.filter === ''
      ? state.anecdotes
      : state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter))
  })
  const dispatch = useDispatch()
  
  const vote = ({ id, content }) => {
    // Lähetetään Redux-storeen äänen antava action.
    dispatch(addVoteTo(id))

    // Lähetetöön Redux-storeen anekdootit järjestävä action.
    dispatch(sortAnecdotes())

    // Lähetetään Redux-storeen ilmoituksen asettava action
    // ja tyhjennetään se actionin avulla 5 sekunnin kuluttua.
    dispatch(setVoteNotification(content))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
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
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  ) 
}

export default AnecdoteList