import { addVoteTo } from '../reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  // Suodatetaan ruudulle renderöitävät anekdootit Redux-storen
  // filter-kentän avulla. Jos suodatin on tyhjä, renderöidään kaikki anekdootit.
  const anecdotes = useSelector(state => {
    return state.filter === ''
      ? state.anecdotes
      : state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter))
  })
  const dispatch = useDispatch()
  
  const vote = (anecdote) => {
    // Lähetetään Redux-storeen äänen antava action.
    dispatch(addVoteTo(anecdote))

    // Lähetetään Redux-storeen ilmoituksen asettava action
    // ja määritetään se poistettavaksi 5 sekunnin kuluttua.
    dispatch(setNotification(`You voted '${anecdote.content}'.`, 5))
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