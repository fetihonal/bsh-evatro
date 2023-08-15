import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import cn from 'classnames'
import styles from './styles.module.css'

const Card = ({ item, img }) => {
  const [title, setTitle] = useState('')
  useEffect(() => {
    let displayTitle = item.productTitles.map((i) =>
      i.tite !== item.code ? i.title + ' ' : ''
    )
    setTitle(displayTitle)
  }, [])
  return (
    <div className='bg-white w-full rounded-xl mb-3'>
      <div className={styles.card}>
        <LazyLoadImage
          effect='blur'
          src={img} // use normal <img> attributes as props
        />
      </div>
      <div className='p-6 '>
        <div className='h-14 mb-3'>
          <strong>{item.code} </strong>
          {title}
        </div>
        <span className='text-primary font-bold'>
          {item.productPrice?.value}
        </span>
      </div>
    </div>
  )
}

export default Card
