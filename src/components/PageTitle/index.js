import React from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'

const PageTitle = ({ icon, title, action }) => {
  return (
    <div className='bg-white w-full p-4 flex items-center justify-between rounded-lg mb-10'>
      <div className='flex items-center gap-4'>
        {icon && icon}
        <span className='text-xl font-bold text-gray-500'>{title}</span>
      </div>
      {action && action}
    </div>
  )
}

export default PageTitle
