import React, { useState, useEffect } from 'react'
import { DatePicker, Input, Select, Form, message, Button } from 'antd'

import { AddCircle } from 'iconsax-react'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { format } from 'date-fns'
import instance from '../../utils/axios'

import cn from 'classnames'
const RegisterStoreForm = ({ setActiveTab }) => {
  const [platform, setPlatform] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [storeName, setStoreName] = useState('')
  const [storeLink, setStoreLink] = useState('')
  const [otherPlatform, setOtherPlatform] = useState('')
  const [platformOptions, setPlatformOptions] = useState([])
  const [isSucces, setIsSucces] = useState(false)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    async function fetchPlatformOptions() {
      try {
        instance.post('/osp_sales_platforms').then((res) => {
          const options = []
          res.data.map((i) => options.push({ label: i.name, value: i.id }))
          setPlatformOptions(options)
        })
      } catch (error) {
        console.error(error)
      }
    }
    fetchPlatformOptions()
  }, [])
  function isValidLink(input) {
    // Bir link için geçerli bir URL yapısı oluşturun
    var regex =
      /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/

    // Girdi ile eşleşen bir düzenleme örüntüsü varsa, bir linktir
    return regex.test(input)
  }

  const resetForm = () => {
    setPlatform('')
    setStartDate(new Date())
    setStoreName('')
    setStoreLink('')
    setOtherPlatform('')
    setIsSucces(false)
  }

  const handleSubmit = async (event) => {
    setLoad(true)

    const data = {
      salesPlatformId: platform,
      salesPlatformName: otherPlatform || platform,
      salesStartDate: startDate,
      storeName,
      storeLink,
    }
    if (isValidLink(storeLink))
      try {
        instance.post('/save_osp', data).then((res) => {
          if (res.data.responseCode === 200) {
            message.success('Kaydınız Oluşturulmuştur')
            setIsSucces(true)
            setLoad(false)
          } else {
            message.error(res.data.responseDesc)
          }
        })
      } catch (error) {
        message.error('Pazaryeri kaydı sırasında bir hata oluştu.')
      }
    else message.warning('Geçerli bir pazaryeri mağaza linki girmediniz.')
  }
  console.log(startDate)
  return (
    <>
      {!isSucces ? (
        <Form layout='vertical' onFinish={handleSubmit}>
          <div className='row osp'>
            <Form.Item label='Pazaryeri Seçimi'>
              <Select
                options={platformOptions}
                value={platform}
                isSearchable
                onChange={(e) => {
                  setPlatform(e)
                  setOtherPlatform()
                }}
                placeholder='Pazaryeri Seçimi'
                required
              />
            </Form.Item>

            {platform === 5 && (
              <Form.Item label='Pazaryeri İsmi'>
                <Input
                  type='text'
                  className='form-control'
                  id='form-otherPlatform'
                  aria-describedby='form-username'
                  placeholder='Pazaryeri İsmi'
                  name='otherPlatform'
                  value={otherPlatform}
                  onChange={(e) => setOtherPlatform(e.target.value)}
                  required
                  autocomplete='off'
                />
              </Form.Item>
            )}
            <Form.Item label='Pazaryeri Satış Başlangıç Tarihi'>
              <DatePicker
                className='w-full'
                // value={dayjs(startDate) || new Date()}
                onChange={(name, date) => setStartDate(date)}
                dateFormat='dd/MM/yyyy'
                placeholderText={'Pazaryeri Satış Başlangıç Tarihi'}
                showTimeInput='false'
              />
            </Form.Item>
            <Form.Item label='  Pazaryeri Mağaza İsmi'>
              <Input
                type='text'
                className='form-control'
                id='form-storeName'
                aria-describedby='form-username'
                placeholder='Pazaryeri Mağaza İsmi'
                name='storeName'
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                autocomplete='off'
              />
            </Form.Item>
            <Form.Item label='  Pazaryeri Mağaza Linki'>
              <Input
                type='text'
                className={cn(
                  'form-control',
                  storeLink.length > 0 &&
                    (isValidLink(storeLink) ? 'is-valid' : 'is-invalid')
                )}
                id='form-storeLink'
                aria-describedby='form-username'
                placeholder=' Lütfen mağaza web adresinizi kopyalayıp yapıştırınız.'
                name='storeLink'
                value={storeLink}
                onChange={(e) => setStoreLink(e.target.value)}
                required
                autocomplete='off'
              />
            </Form.Item>

            {localStorage.getItem('clientUser') === 'true' && (
              <Button
                type='primary'
                size='large'
                htmlType='submit'
                disabled={platform === '' && load}
                className='w-full'
              >
                Kaydet
              </Button>
            )}
          </div>
        </Form>
      ) : (
        <div className='w-full rounded-lg p-3 bg-green-500 text-white text-center'>
          <h2>Kaydınız Oluşturulmuştur.</h2>

          <Button
            type='dashed'
            size='large'
            className='w-full mt-3'
            onClick={() => {
              resetForm()
            }}
          >
            Yeni Kayıt Oluştur
          </Button>
        </div>
      )}
    </>
  )
}
export default RegisterStoreForm
