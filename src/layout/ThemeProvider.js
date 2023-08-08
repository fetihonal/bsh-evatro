// HomePage.js

import React, { useContext, useEffect } from 'react'
import { ThemeContext } from '../context/themeContext'
import { ConfigProvider } from 'antd'
import styled, { ThemeProvider } from 'styled-components'
import { bosh, profilo, siemens } from './tailwindTheme'

const Theme = (props) => {
  const { children } = props
  // "theme" değerini state olarak tut
  const [theme, setTheme] = React.useState(bosh)
  useEffect(() => {
    // localStorage'den "theme" değerini al
    const storedTheme = localStorage.getItem('theme')
    console.log('storedTheme', storedTheme)
    // Eğer "theme" değeri 1, 2 veya 3 ise, "theme" değerini güncelle
    if (storedTheme === '1' || storedTheme === '2' || storedTheme === '3') {
      const theme =
        storedTheme === '1' ? bosh : storedTheme === '2' ? siemens : profilo
      setTheme(theme)
    }
  }, [])
  const customTheme = {
    token: theme,
  }
  console.log(theme)
  return (
    <ThemeContext.Provider value={{setTheme }}>
      <ThemeProvider theme={theme}>
        <ConfigProvider theme={customTheme}>{children}</ConfigProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default Theme
