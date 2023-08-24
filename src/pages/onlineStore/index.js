import React, { useState, useEffect } from 'react'
import instance from '../../utils/axios'
import { Badge, Row, Col, Form } from 'antd'
import { Shop, Notification, Box } from 'iconsax-react'
import PageTitle from '../../components/PageTitle'
import RegisterStoreForm from './RegisterStoreForm'
import OnlineSalePlatformsList from './OnlineSalePlatformsList'
import NotificationModal from './NotificationModal'

const OnlineStore = () => {
  const [acitveTab, setActiveTab] = useState(1)
  const [activeStore, setActiveStore] = useState(0)
  const [notificationRedirectActive, setNotificationRedirectActive] =
    useState(false)
  const [notificationRedirectData, setNotificationRedirectData] = useState()
  const [count, setCount] = useState(0)
  const [notificationData, setNotificationData] = useState([])
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    setTimeout(function () {
      !showModal &&
        instance
          .post('/notifications?FCMNotificationKey=OSPAssessment')
          .then((res) => {
            setNotificationData(res.data)
            setCount(res.data.filter((i) => i.unread === true).length)
          })
    }, 1500)
  }, [showModal])

  const notificationRedirect = (
    id,
    assessmentId,
    assessmentHistoryId,
    title,
    status
  ) => {
    setNotificationRedirectData({
      assessmentId,
      assessmentHistoryId,
      title,
      status,
    })
    setNotificationRedirectActive(true)
    setActiveStore(id)

    setActiveTab(2)
  }
  return (
    <>
      <PageTitle
        title={'Pazar Yeri Mağaza Bilgilendirme'}
        icon={<Shop color='#8E92BC' />}
        action={
          count > 0 && (
            <Badge
              count={count}
              showZero
              onClick={() => {
                setShowModal(true)
                setActiveStore(0)
              }}
              className='bg-primary text-white p-2 rounded-full cursor-pointer'
            >
              <Notification color='#fff' />
            </Badge>
          )
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
              <Shop color='#8E92BC' />
              Pazar Yeri Mağaza Kayıt
            </h1>
            <RegisterStoreForm setActiveTab={setActiveTab} />
          </div>
        </Col>
        <Col className='gutter-row ' span={18}>
          <div className=''>
            <OnlineSalePlatformsList
              setActiveTab={setActiveTab}
              activeStore={activeStore}
              setNotification={setNotificationRedirectActive}
              notification={notificationRedirectActive}
              notificationRedirectData={notificationRedirectData}
            />
          </div>
        </Col>
      </Row>
      <div className='customer'>
        <div className='inputBoxBorder mt-3'>
          {showModal && (
            <NotificationModal
              showModal={showModal}
              setShowModal={setShowModal}
              data={notificationData}
              notificationRedirect={(
                id,
                assessmentId,
                assessmentHistoryId,
                title,
                status
              ) =>
                notificationRedirect(
                  id,
                  assessmentId,
                  assessmentHistoryId,
                  title,
                  status
                )
              }
            />
          )}
        </div>
      </div>
    </>
  )
}
export default OnlineStore
