import React, { useState, useEffect } from 'react'
import {
  Col,
  Skeleton,
  Row,
  Modal,
  Select,
  Button,
  Checkbox,
  Empty,
  Input,
  DatePicker,
  message,
} from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import cn from 'classnames'
import instance from '../utils/axios'
import PageTitle from '../components/PageTitle'
import { TicketDiscount, SearchFavorite, Filter } from 'iconsax-react'
import { format } from 'date-fns'
const CouponManagement = (props) => {
  const [code, setCode] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [data, setData] = useState([])
  const [historyData, setHistoryData] = useState([])
  const [selectedCode, setSelectedCode] = useState([])
  const [filter, setFilter] = useState({
    startDate: new Date(),
    endDate: new Date(),
    couponCodes: '',
  })

  useEffect(() => {
    getHistoryData()
  }, [])
  const getHistoryData = () => {
    setIsDataLoaded(true)
    instance.post('/coupon_usage_history', {}).then((res) => {
      setHistoryData(res.data)
      setIsDataLoaded(false)
    })
  }
  const getFilterHistoryData = () => {
    setIsDataLoaded(true)
    const filterData = {
      couponCodes: filter.couponCodes.split(' '),
      startDate: format(new Date(filter.startDate), 'yyyy-MM-dd hh:mm:ss'),
      endDate: format(new Date(filter.endDate), 'yyyy-MM-dd hh:mm:ss'),
    }
    instance.post('/coupon_usage_history', filterData).then((res) => {
      setHistoryData(res.data)
      setIsDataLoaded(false)
    })
  }

  const validationCode = (code) => {
    setIsLoaded(true)
    if (code.length === 0) {
      message.info('Kupon kodu alanını boş bıraktınız.')
      setIsLoaded(false)
      return false
    } else {
      instance.post(`/coupon_validation?CouponCode=${code}`).then((res) => {
        setData(
          res.data.couponValidationResponses.sort((a, b) => {
            if (a.couponStatu === 200 && b.couponStatu !== 200) {
              return -1
            } else if (a.couponStatu !== 200 && b.couponStatu === 200) {
              return 1
            } else {
              return 0
            }
          })
        )
        if (res.data.couponValidationResponses.length > 0) {
          setIsOpen(true)
          setIsLoaded(false)
        } else {
          message.info('Tanımlı olmayan bir kupon kodu girdiniz.')
        }
      })
    }
  }

  const redemption = () => {
    instance
      .post(`/coupon_redemption?CouponCode=${selectedCode.join(' ')}`)
      .then((res) => {
        if (res.status == 200) {
          getHistoryData()
          setIsOpen(false)
          setData([])
          setSelectedCode([])
          res.data.couponValidationResponses.map((i) => {
            if (i.couponStatu != 200) {
              ToastUtility.warning(
                `"${i.couponCode} ;" Kupon kodu kullanılamadı.`,
                i.couponCode
              )
            }
          })
          if (
            res.data.couponValidationResponses.filter(
              (i) => i.couponStatu == 200
            ).length > 0
          ) {
            ToastUtility.success('Kupon kullanımı başarılı.', 'success')
          }
        }
      })
  }
  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedCode([...selectedCode, e.target.value])
    } else {
      setSelectedCode(selectedCode.filter((i) => i != e.target.value))
    }
  }
  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value)
    console.log('Formatted Selected Time: ', dateString)
  }

  return (
    <>
      <PageTitle
        title='Kupon Yönetimi'
        icon={<TicketDiscount color='#8E92BC' />}
        action={
          <Input.Search
            placeholder='Kupon Kodu Giriniz.'
            onSearch={() => validationCode(code)}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            enterButton
            loading={isLoaded}
            className='w-1/4'
          />
        }
      />
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
        className='px-4'
      >
        <Col className='gutter-row ' span={6}>
          <div className=' bg-white rounded-lg p-8'>
            <h1 className='text-xl  text-gray-500 pb-1 border-b-2 border-primary flex items-center gap-2 mb-5'>
              <SearchFavorite color='#8E92BC' />
              Geçmiş Kupon Arama
            </h1>

            <div className='py-3'>
              <Input
                placeholder='Kupon kodu giriniz'
                value={filter.couponCodes}
                onChange={(e) =>
                  setFilter({ ...filter, couponCodes: e.target.value })
                }
              />
              <DatePicker
                className='w-full mt-3'
                showTime
                placeholder='Başlangıç Tarihi'
                // value={dayjs(filter.startDate) || new Date()}
                onChange={(e, b) => setFilter({ ...filter, startDate: b })}
              />
              <DatePicker
                className='w-full mt-3'
                showTime
                // value={dayjs(filter.endDate) || new Date()}
                placeholder='Bitiş Tarihi'
                onChange={(e, b) => setFilter({ ...filter, endDate: b })}
              />
              <div className='flex items-center justify-end gap-3 mt-3'>
                <Button
                  size='lg'
                  onClick={() => {
                    getHistoryData()
                    setFilter({
                      startDate: new Date(),
                      endDate: new Date(),
                      couponCodes: '',
                    })
                  }}
                >
                  Filtreyi Temizle
                </Button>
                <Button
                  type='primary'
                  size='lg'
                  onClick={() => getFilterHistoryData()}
                >
                  Filtrele
                </Button>
              </div>
            </div>
          </div>
        </Col>
        <Col className='gutter-row' span={18}>
          <div className=' bg-white rounded-lg p-8'>
            <h2 className='text-xl text-[#030229] font-bold mb-6'>
              Kupon Listeleme
            </h2>
            {!isDataLoaded ? (
              historyData.length > 0 ? (
                <table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                  <thead class='text-xs text-gray-700 uppercase border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                      <th scope='col' class='px-6 py-3'>
                        Kupon Kodu
                      </th>
                      <th scope='col' class='px-6 py-3'>
                        Durum
                      </th>
                      <th scope='col' class='px-6 py-3'>
                        Tarih
                      </th>
                      <th scope='col' class='px-6 py-3'>
                        Kullanıcı
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((i) => (
                      <tr class='bg-white  hover:bg-gray-300 transition-all rounded-lg dark:border-gray-700 cursor-pointer'>
                        <th
                          scope='row'
                          class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                        >
                          {i.couponCode}
                        </th>
                        <td class='px-6 py-4'>Kullanıldı</td>
                        <td class='px-6 py-4'>
                          {format(
                            new Date(i.couponUsedDate),
                            'dd/MM/yyyy HH:mm:ss'
                          )}
                        </td>
                        <td class='px-6 py-4'>{i.workerName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='flex items-center justify-center p-3 mt-4 w-full'>
                  <Empty description='Kayıtlı Kupon Bulunamadı' />
                </div>
              )
            ) : (
              <div className='flex items-center justify-center p-2 mt-4'>
                <Skeleton />
              </div>
            )}
          </div>
        </Col>
        <Modal
          open={isOpen}
          title='Kupon Kodlarım'
          //   onOk={handleOk}
          onCancel={() => {
            setIsOpen(false)
            setData([])
            setSelectedCode([])
          }}
          footer={[
            <Button
              type='primary'
              size='large'
              disabled={selectedCode.length == 0}
              onClick={() => redemption()}
            >
              {selectedCode.length > 0 ? 'Seçilen Kodu Kullan' : 'Kod Seçiniz'}{' '}
            </Button>,
          ]}
          width={'50%'}
        >
          <table class='w-full text-sm text-left text-gray-500 dark:text-gray-400 border-b'>
            <thead class='text-xs text-gray-700 uppercase border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' class='px-6 py-3'>
                  #
                </th>
                <th scope='col' class='px-6 py-3'>
                  Kupon Kodu
                </th>

                <th scope='col' class='px-6 py-3'>
                  Durum
                </th>
                <th scope='col' class='px-6 py-3'>
                  Promosyon
                </th>
              </tr>
            </thead>
            <tbody>
              {!isLoaded ? (
                data.map((i, key) => {
                  return (
                    <tr
                      key={key}
                      class='bg-white  hover:bg-gray-300 transition-all rounded-lg dark:border-gray-700 cursor-pointer'
                    >
                      <th
                        scope='row'
                        class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                      >
                        {i.couponPromotionCode !==
                          'Promosyon Kodu Bulunamadı' && i.couponPromotion ? (
                          <Checkbox
                            value={i.couponCode}
                            onChange={handleCheckboxChange}
                            className='radioSize'
                          />
                        ) : (
                          '-'
                        )}
                      </th>
                      <td class='px-6 py-4'>{i.couponCode}</td>
                      <td class='px-6 py-4'>
                        {i.couponPromotion === undefined
                          ? 'Kupon Kullanılamaz'
                          : i.couponDescription}
                      </td>
                      <td class='px-6 py-4'>
                        {i.couponPromotionCode == 'Promosyon Kodu Bulunamadı'
                          ? i.couponPromotionCode
                          : i.couponPromotion === undefined
                          ? 'Kupon Değeri Tanımlanmamıştır'
                          : i.couponPromotion}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <div className='flex justify-content-center p-2'>
                  <Skeleton />
                </div>
              )}
            </tbody>
          </table>
        </Modal>
      </Row>
    </>
  )
}
export default CouponManagement
