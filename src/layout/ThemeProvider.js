// HomePage.js

import React, { useState, useEffect } from 'react'
import { ConfigProvider, Input } from 'antd'
import trTR from 'antd/lib/locale/tr_TR'
import styled, { ThemeProvider } from 'styled-components'

import { bosh, profilo } from './tailwindTheme'

import classNames from 'classnames'

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
`

const ButtonContainer = styled.div`
  ${`mt-4`}
`

const Theme = (props) => {
  const { children } = props
  // "theme" değerini state olarak tut
  const [theme, setTheme] = React.useState(bosh)
  useEffect(() => {
    // localStorage'den "theme" değerini al
    const storedTheme = localStorage.getItem('theme')

    // Eğer "theme" değeri 1, 2 veya 3 ise, "theme" değerini güncelle
    if (storedTheme === '1' || storedTheme === '2' || storedTheme === '3') {
      const theme =
        storedTheme === '1' ? bosh : storedTheme === '2' ? profilo : {}
      setTheme(theme)
    }
  }, [])
  const customTheme = {
    token: theme,
  }
  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider theme={customTheme}>{children}</ConfigProvider>
    </ThemeProvider>
  )
}

export default Theme
