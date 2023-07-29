import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import instance from '../utils/axios'

const TestPage = () => {
  useEffect(() => {
    instance.post('/popup', { companyPartnerId: '4', path: '/' })
  }, [])
  return (
    <div className='flex h-screen'>
      Home Page <Link to='/login'>Login</Link>
    </div>
  )
}

export default TestPage
