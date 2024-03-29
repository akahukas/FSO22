import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import UsersList from './components/UsersList'
import User from './components/User'
import IndividualBlog from './components/IndividualBlog'
import { store } from './store'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './index.css'

// Välitetään Redux-store <Provider /> -komponentin
// lapsille. Hyödynnetään Routeria routejen sekä niissä
// näkyvien elementtien määrittämiseen.
ReactDOM.createRoot(document.getElementById('root')).render(
  <div
    style={{
      backgroundColor: '#0d3446',
      minHeight: '100vh',
    }}
  >
    <div className="container">
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/blogs/:id" element={<IndividualBlog />} />
          </Routes>
        </Router>
      </Provider>
    </div>
  </div>
)
