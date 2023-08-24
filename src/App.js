import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Routes,
  Navigate,
} from 'react-router-dom'
import { setAuthorizationToken } from './helpers/setAuthorizationToken'
import Theme from './layout/ThemeProvider'

import Layout from './layout'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import ProductsPage from './pages/Products'
import CouponManagement from './pages/CouponManagement'
import OnlineStore from './pages/onlineStore'

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
            path='/products'
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/coupon-management'
            element={
              <ProtectedRoute>
                <CouponManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='/online-store'
            element={
              <ProtectedRoute>
                <OnlineStore />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Theme>
  )
}

export default App
