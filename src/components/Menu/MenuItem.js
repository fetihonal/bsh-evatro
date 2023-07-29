import React from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import styles from './styles.module.css'

const MenuItem = ({ to, icon, title, active }) => {
  return (
    <Link to={to} className='flex items-center flex-wrap m-auto mb-10'>
      <div className={cn(styles.item, active ? styles.active : '')}>
        {icon && icon}
      </div>
      <div className={styles.title}>{title}</div>
    </Link>
  )
}

export default MenuItem
