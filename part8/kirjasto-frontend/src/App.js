import { useState } from 'react'
import { useSubscription, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import BirthyearForm from './components/BirthyearForm'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import RecommendedBooks from './components/RecommendedBooks'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

// Funktio joka vastaa välimuistin manipuloinnista.
export const updateCache = (cache, query, addedBook) => {
  const uniqueByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k)
        ? false
        :seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqueByName(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  // Hyödynnetään tilauksen mukana saatua dataa.
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(
        `
        Received a new response from bookAdded-subscription.
        A new book has been added with the following data:
        Book title: ${addedBook.title}
        Book author: ${addedBook.author.name}
        `
      )
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  // Uloskirjautumisesta vastaava tapahtumakäsittelijä.
  const logout = () => {
    // Poistetaan Token sovelluksen tilasta,
    // localStoragesta sekä Apollosta.
    setToken(null)
    localStorage.clear()
    client.resetStore()
    
    // Vältetään tyhjälle sivulle päätyminen.
    if (
      page === 'add' ||
      page === 'setBirthyear' ||
      page === 'recommended') {
      setPage('authors')
    }
  }

  // Ruudulle renderöitävät komponentit
  // jos käyttäjä ei ole kirjautunut sisään.
  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Notify errorMessage={errorMessage}/>

        <Authors show={page === 'authors'} />

        <Books show={page === 'books'} />

        <LoginForm
          show={page === 'login'}
          setToken={setToken}
          setError={notify}
          setPage={setPage}
        />
      </div>
    )
  }

  // Ruudulle renderöitävät komponentit
  // käyttäjän ollessa sisäänkirjautunut.
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('setBirthyear')}>set birthyear</button>
        <button onClick={() => setPage('recommended')}>recommended</button>
        <button onClick={logout}>logout</button>
      </div>

      <Notify errorMessage={errorMessage}/>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <BirthyearForm
        show={page === 'setBirthyear'}
        setError={notify}
      />

      <RecommendedBooks show={page === 'recommended'} />
    </div>
  )
}

export default App
