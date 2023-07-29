import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Routes,
  Navigate,
} from 'react-router-dom'
import { setAuthorizationToken } from './helpers/setAuthorizationToken'
import jwtDecode from 'jwt-decode'
import Theme from './layout/ThemeProvider'
import './app.styles.scss'

import Layout from './layout'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import TestPage from './pages/Test'

const ProtectedRoute = ({ children }) => {
  const jwtToken = localStorage.getItem('jwtToken')

  if (!jwtToken) {
    return <Navigate to={'/login'} replace />
  }

  return <Layout>{children}</Layout>
}

const App = () => {
  const [jwtToken] = useState(localStorage.getItem('jwtToken'))

  useEffect(() => {
    if (jwtToken) {
      setAuthorizationToken(jwtToken)
    }
  }, [])

  return (
    <Theme>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/test'
            element={
              <ProtectedRoute>
                <TestPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Theme>
  )
}

export default App
