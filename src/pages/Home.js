import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import instance from '../utils/axios'

const HomePage = () => {
  useEffect(() => {
    instance.post('/popup', { companyPartnerId: '4', path: '/' })
  }, [])
  return (
    <div className='flex h-screen'>
      Home Page <br />
      <Link to='/test' className='w-full block'>
        Home
      </Link>
    </div>
  )
}

export default HomePage
