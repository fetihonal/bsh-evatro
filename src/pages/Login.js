import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Button } from 'antd'
import { setAuthorizationToken } from '../helpers/setAuthorizationToken'
import instance from '../utils/axios'

import { Sms, Lock } from 'iconsax-react'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    deviceId: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const navigate = useNavigate()
  const handleOnClick = useCallback(() => navigate('/'), [navigate])
  const handleSubmit = (e) => {
    e.preventDefault()

    instance
      .post('/login', formData)
      .then((res) => {
        const jwToken = res.data.jwToken
        setAuthorizationToken(jwToken)
        handleOnClick()
        console.log('asd', res.data)
        localStorage.setItem('theme', res.data.companyPartnerId)
      })
      .catch((error) => {
        console.error('API Error:', error)
      })
  }

  return (
    <div className='flex h-screen'>
      <div className='flex-1 flex justify-center items-center bg-loginBg text-white'>
        {/* Sol taraftaki resim */}
        BAYİ İLETİŞİM FORMU
      </div>
      <div className='flex-1 flex justify-center items-center'>
        {/* Sağ taraftaki login formu */}
        <div className='w-full max-w-md'>
          <form className='login-form' onSubmit={handleSubmit}>
            <h2 className='text-3xl font-bold mb-6'>Giriş Yap</h2>
            <div className='mb-4'>
              <Input
                size='large'
                type='text'
                prefix={<Sms />}
                placeholder='Kullanıcı Adı'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className='mb-4'>
              <Input.Password
                size='large'
                prefix={<Lock />}
                placeholder='Şifre'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <Button type='primary' size='large' htmlType='submit' block>
              Giriş Yap
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
