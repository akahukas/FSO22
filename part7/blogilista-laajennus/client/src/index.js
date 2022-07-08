import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import UsersList from './components/UsersList'
import { store } from './store'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './index.css'

// Välitetään Redux-store <Provider /> -komponentin
// lapsille. Hyödynnetään Routeria routejen sekä niissä
// näkyvien elementtien määrittämiseen.
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/users' element={<UsersList />} />
      </Routes>
    </Router>
  </Provider>
)
