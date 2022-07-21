import { addNewAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

const AnecdoteForm = (props) => {

  const addAnecdote = async (event) => {
    event.preventDefault()
    
    // Tallennetaan muuttujaan uuden anekdootin 
    // teksti ja tyhjennetään syöttökenttä.
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    // Lähetetään Redux-storeen uuden 
    // anekdootin lisäävä asynkroninen action.
    props.addNewAnecdote(content)

    // Lähetetään Redux-storeen ilmoituksen asettava action
    // ja määritetään se poistettavaksi 5 sekunnin kuluttua.
    props.setNotification(`You added '${content}' to the list of Anecdotes.`, 5)
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

// Määritellään actionit propsien kautta välitettäväksi.
const mapDispatchToProps = {
  addNewAnecdote,
  setNotification,
}

// Määritellään yhdistetyksi komponentiksi.
const ConnectedAnecdoteForm = connect(
  null,
  mapDispatchToProps
)(AnecdoteForm)

export default ConnectedAnecdoteForm