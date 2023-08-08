import React, { useState } from 'react'
import { Button, Input, Modal, Form, Radio, message } from 'antd'
import InputMask from 'react-input-mask'
import { getUnformattedPhoneNumber } from '../../helpers/FormatUtility'
import instance from '../../utils/axios'
const NewPasswordPopup = (props) => {
  const { open, handleOk, handleCancel} = props
  const [resetAddress, setResetAddress] = React.useState('email')
  const [recoveryEmail, setRecoveryEmail] = React.useState('')
  const [recoveryAlternativeEmail, setRecoveryAlternativeEmail] =
    React.useState('')
  const [recoveryPhone, setRecoveryPhone] = React.useState('')
const [form] = Form.useForm()

  function optionSelectHandler(value) {
    setResetAddress(value)
    setRecoveryEmail('')
    setRecoveryAlternativeEmail('')
    setRecoveryPhone('')
  }
  const onFinish = () => {
   sendRecovery()
  }
  const onFinishFailed = () => {
    message.error('Lütfen ilgili alanı doldurunuz')
  }



  function sendRecovery() {
    if (
      
      (resetAddress === 'sms' && recoveryPhone === '')
    ) {
      message.error('Lütfen ilgili alanı doldurunuz.')
    }

    if (recoveryEmail !== '') {
      instance
        .post('/forgot_password_immediate', {
          email: recoveryEmail,
          language: 'tr_TR',
        })
        .then(
          (response) => {
            message.success('Yeni parolanız mailinize iletildi.');
            handleCancel()
          },
          (error) => {
            if (error.response) {
              if (error.response.status === 401) {
                message.error(
                  'Girmiş olduğunuz maile ait kullanıcı sistemde tanımlı değildir. Marka direktörlüğünüz ile iletişime geçiniz.'
                )
              } else if (error.response.status === 406) {
                message.error(
                  'Girmiş olduğunuz maile ait kullanıcınız veya bayisi aktif değildir. Marka direktörlüğünüz ile iletişime geçiniz.'
                )
              } else {
                message.error('Beklenmedik bir hata oluştu.')
              }
            }
          }
        )
    } else if (recoveryAlternativeEmail !== '') {
      instance
        .post('/forgot_password_immediate', {
          alternativeEmail: recoveryAlternativeEmail,
          language: 'tr_TR',
        })
        .then(
          (response) => {
            message.success('Yeni parolanız mailinize iletildi.')
            handleCancel()
          },
          (error) => {
            if (error.response) {
              if (error.response.status === 401) {
                message.error(
                  'Girmiş olduğunuz alternatif maile ait kullanıcı sistemde tanımlı değildir. Marka direktörlüğünüz ile iletişime geçiniz.'
                )
              } else if (error.response.status === 406) {
                message.error(
                  'Girmiş olduğunuz alternatif maile ait kullanıcınız veya bayisi aktif değildir. Marka direktörlüğünüz ile iletişime geçiniz.'
                )
              } else {
                message.error('Beklenmedik bir hata oluştu.')
              }
            }
          }
        )
    } else if (recoveryPhone !== '') {
      instance.post('/reset_password_with_sms?Phone=' + recoveryPhone, {}).then(
        (response) => {
          message.success('Yeni parolanız telefon numaranıza iletildi.')
          handleCancel()
        },
        (error) => {
          if (error.response) {
            if (error.response.status === 401) {
              message.error(
                'Girmiş olduğunuz telefon numarasına ait kullanıcı sistemde tanımlı değildir. Marka direktörlüğünüz ile iletişime geçiniz.'
              )
            } else if (error.response.status === 406) {
              message.error(
                'Girmiş olduğunuz telefon numarasına ait kullanıcınız veya bayisi aktif değildir. Marka direktörlüğünüz ile iletişime geçiniz.'
              )
            } else {
              message.error('Beklenmedik bir hata oluştu.')
            }
          }
        }
      )
    }
  }
  const validateMessages = {
    required: "'${name}' alanı zorunlu!",
    // ...
  }

  return (
    <Modal
      open={open}
      title='Yeni Parola Talep Et'
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        validateMessages={validateMessages}
      >
        <div className='flex '>
          <Radio.Group
            defaultValue='email'
            buttonStyle='solid'
            className='mt-4 mx-auto w-full'
          >
            <Radio.Button
              className='w-1/3 text-center'
              value='email'
              onChange={(e) => optionSelectHandler(e.target.value)}
            >
              E-Mail
            </Radio.Button>
            <Radio.Button
              className='w-1/3 text-center'
              value='alternativeEmail'
              onChange={(e) => optionSelectHandler(e.target.value)}
            >
              Alternatif E-mail
            </Radio.Button>
            <Radio.Button
              className='w-1/3 text-center'
              value='sms'
              onChange={(e) => optionSelectHandler(e.target.value)}
            >
              Sms
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className='mt-4 block'>
          {resetAddress === 'email' && (
            <Form.Item
              label='E-Mail'
              name='Email'
              rules={[
                {
                  required: true,
                },
                {
                  type: 'email',
                },
              ]}
            >
              <Input
                placeholder='E-Posta Adresinizi Giriniz'
                aria-label='eposta'
                aria-describedby='123'
                size='large'
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
              />
            </Form.Item>
          )}
          {resetAddress === 'alternativeEmail' && (
            <Form.Item
              label='Alternatif E-mail'
              name='Alternatif E-mail'
              rules={[
                {
                  required: true,
                },
                {
                  type: 'email',
                },
              ]}
            >
              <Input
                placeholder='Alternatif E-Posta Adresinizi Giriniz'
                aria-label='alternativeEmail'
                aria-describedby='123'
                size='large'
                value={recoveryAlternativeEmail}
                onChange={(e) => setRecoveryAlternativeEmail(e.target.value)}
              />
            </Form.Item>
          )}
          {resetAddress === 'sms' && (
            <Form.Item
              label='Sms'
              name='sms'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputMask
                id='phone'
                className='ant-input ant-input-lg'
                aria-describedby='smsChange'
                mask={'+\\90 (999) 999 99 99'}
                value={recoveryPhone}
                onChange={(e) =>
                  setRecoveryPhone(
                    getUnformattedPhoneNumber(e.target.value).slice(1)
                  )
                }
                placeHolder='+90 (___) ___ __ __'
              />
            </Form.Item>
          )}
        </div>
        <div className='flex justify-end'>
          <Button
            htmlType='submit'
            type='primary'
            size='large'
            className='bg-primary'
            // block
          >
            Gönder
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default NewPasswordPopup
 