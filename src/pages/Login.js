import React, { useState, useCallback,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Button, notification } from 'antd'
import { setAuthorizationToken } from '../helpers/setAuthorizationToken'
import instance from '../utils/axios'
import Logo from '../assets/logo.png'
import { Sms, Lock,InfoCircle,Key } from 'iconsax-react'
import NewPasswordPopup from '../components/Login/NewPasswordPopup'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    deviceId: '',
  })
  const [open, setOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification()
  useEffect(()=> {
    localStorage.removeItem('theme')
  },[])

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
        localStorage.setItem('theme', res.data.companyPartnerId)
        setAuthorizationToken(jwToken)
        handleOnClick()
        
      })
      .catch((error) => {
         api.open({
        message: 'Giriş Bilgi',
        description: 'Kullanıcı adı veya şifre hatalı.',
        placement: 'topRight',
        icon: <InfoCircle style={{ color: '#108ee9' }} />,
      })
      })
  }
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    
    setTimeout(() => {
      
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

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
            <img src={Logo} height={68} />
            <span className='text-md block mt-4 mb-4 text-greyColor'>
              Bayi İletişim Platromu
            </span>

            <div className='mb-4'>
              <Input
                size='large'
                type='text'
                prefix={<Sms color='#64748B' className='mr-2' />}
                placeholder='Kullanıcı Adı'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className='mb-4'>
              <Input.Password
                size='large'
                prefix={<Lock color='#64748B' className='mr-2' />}
                placeholder='Şifre'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className='flex items-center justify-start  gap-2 mb-4'>
              <Key className='text-primary' />
              <span
                className='text-primary cursor-pointer'
                onClick={() => showModal()}
              >
                Yeni Parola Talep Et
              </span>
            </div>
            <Button
              type='primary'
              size='large'
              htmlType='submit'
              className='bg-primary'
              block
            >
              Giriş Yap
            </Button>
            {contextHolder}
          </form>
        </div>
      </div>
      <NewPasswordPopup
        open={open}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  )
}

export default LoginPage
