const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

// Äänestyksen action creator.
export const addVoteTo = (id) => {
  // Asetetaan actionin tyypiksi äänen antaminen
  // ja lähetetään datan mukana anekdoottia vastaava id.
  return {
    type: 'UPVOTE',
    data: { id }
  }
}
// Uuden anekdootin luomisen action creator.
export const addNewAnecdote = (content) => {
  // Asetetaan actionin tyypiksi uuden anekdootin luonti
  // ja lähetetään datan mukana uusi anekdoottiolio.
  return {
    type: 'NEW_ANECDOTE',
    data: asObject(content)
  }
}

const reducer = (state = initialState, action) => {
  //console.log('state now: ', state)
  //console.log('action', action)
  
  switch (action.type) {
    case 'UPVOTE':

      // Tallennetaan muuttujaan anekdootin tunniste 
      // ja haetaan tilasta tunnistetta vastaava anekdootti.
      const id = action.data.id
      const anecdoteToVote = state.find(
        anecdote => anecdote.id === id
      )
      
      // Muokattava anekdootti, kopioidaan tilasta tiedot
      // ja kasvatetaan anekdootin äänimäärää yhdellä.
      const changedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      
      // Korvataan tilassa alkuperäinen anekdootti muokatulla,
      // säilytetään muut anekdootit ennallaan.
      return state.map(
        anecdote => anecdote.id === id ? changedAnecdote : anecdote
      )

    case 'NEW_ANECDOTE':
      // Palautetaan kopio alkuperäisestä tilasta, jonka perään
      // on liitetty actionin mukana lähetetty anekdoottiolio.
      return [ ...state, action.data ]
    
    default:
      return state
  }
}

export default reducer