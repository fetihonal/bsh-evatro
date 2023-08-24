import React, { useState, useEffect, useRef } from 'react'
import instance from '../../utils/axios'
import { Empty, Skeleton } from 'antd'
import {
  ArchiveTick,
  ClipboardClose,
  MessageSearch,
  ArrowCircleUp,
  ArrowCircleDown,
  BackSquare,
} from 'iconsax-react'
import moment from 'moment'
import { format } from 'date-fns'
import cn from 'classnames'
import HistoryModal from './HistoryModal'

const OnlineSalePlatformsList = (props) => {
  const {
    activeStore,
    notification,
    setNotification,
    notificationRedirectData,
  } = props
  const ref = useRef(null)
  const [isLoad, setIsLoad] = useState(false)
  const [platforms, setPlatforms] = useState([])
  const [isAllView, setIsAllView] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedOspAssessments, setSelectedOspAssessments] = useState({})
  useEffect(() => {
    async function fetchPlatforms() {
      try {
        instance.post('/osp').then((res) => {
          setPlatforms(res.data)
          setIsLoad(true)
        })
      } catch (error) {
        console.error(error)
      }
    }
    if (!showModal) fetchPlatforms()
  }, [showModal])
  useEffect(() => {
    platforms.length > 0 && props.activeStore > 0 && handleScroll()
  }, [platforms, props.activeStore])

  const ospAssessmentsById = (item) => {
    setSelectedOspAssessments({ item })
    setShowModal(true)
  }

  const checkStatus = (ospAssessments) => {
    const statusOk = ospAssessments.filter((i) => i.status.id === 2)
    const statusNotOk = ospAssessments.filter((i) => i.status.id === 3)
    const statusWait = ospAssessments.filter((i) => i.status.id === 1)

    if (ospAssessments.length === statusOk.length) {
      return <ArchiveTick className='text-green-600' />
    } else if (statusNotOk.length > 0) {
      return <ClipboardClose className='text-red-600' />
    } else {
      return <MessageSearch className='text-gray-500' />
    }
  }

  const handleScroll = () => {
    ref.current &&
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    if (notification) {
      let item = platforms.filter((i) => i.id == activeStore)[0]

      item = item.ospAssessments
        .filter((i) => i.id == notificationRedirectData.assessmentId)[0]
        .subAssessments.filter(
          (i) => i.id == notificationRedirectData.assessmentHistoryId
        )[0]

      instance
        .post(
          `osp_assessments?MainAssessmentId=${notificationRedirectData.assessmentHistoryId}`
        )
        .then((res) => {
          setSelectedOspAssessments({ item, data: res.data })
          setShowModal(true)
        })
    }
  }

  return (
    <div className='online-sale-platform-list'>
      {isLoad ? (
        platforms.map((platform, index) => (
          <details
            key={index}
            ref={props.activeStore === platform.id ? ref : null}
            open={props.activeStore === platform.id}
            id={`store-${platform.id}`}
            className='bg-white p-3 rounded-xl mb-4 border-0 shadow-md'
          >
            <summary>
              <div className='info'>
                <h2 className='text-xl text-primary flex items-center gap-2 mb-2'>
                  {platform.salesPlatformName}
                  {checkStatus(platform.ospAssessments)}
                </h2>
                <div className='brand'>
                  {platform.storeName}
                  <div className='flex'>
                    <span>
                      {format(new Date(platform.salesStartDate), 'dd/MM/yyyy')}
                      {/* {format(new Date(platform.salesStartDate), "d/m/yyyy hh:")} */}
                    </span>
                    <ArrowCircleDown className='down' size={20} />
                    <ArrowCircleUp className='up' size={20} />
                  </div>
                </div>
                <a
                  href={`${platform.storeLink}`}
                  target='_blank'
                  className='link'
                >
                  {platform.storeLink}
                </a>
              </div>
            </summary>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 border-t mt-4'>
              <thead className='text-xs text-gray-700 uppercase border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400'>
                <th scope='col' className='px-6 py-3'>
                  BSH Kontrol
                </th>
                <th scope='col' className='px-6 py-3'>
                  Durum
                </th>
                <th scope='col' className='px-6 py-3'>
                  Güncelleme Tarihi
                </th>
                <th scope='col' className='px-6 py-3 text-center'>
                  İşlem
                </th>
              </thead>
              <tbody>
                {platform.ospAssessments.map((i) => (
                  <>
                    <tr
                      key={i.assessmentCategory.name}
                      className={cn(
                        i.assessmentCategory.root
                          ? 'text-white bg-black'
                          : 'text-black hover:bg-gray-300 transition-all',
                        ' rounded-lg cursor-pointer'
                      )}
                    >
                      <th
                        scope='row'
                        className={cn(
                          'px-6 py-4 font-medium  whitespace-nowrap ',
                          i.assessmentCategory.root
                            ? 'text-white'
                            : 'text-primary'
                        )}
                      >
                        <strong>{i.assessmentCategory.name}</strong>
                      </th>
                      <td className='px-6 py-4'>
                        <strong>{i.status.name}</strong>
                      </td>
                      <td className='px-6 py-4'>
                        <strong>
                          {moment(i.lastUpdateTime).format('DD/MM/yyyy')}{' '}
                        </strong>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        {/* {i.assessmentCategory.id !== 14 && (
                        <UilEye
                          className="view-button"
                          onClick={() => ospAssessmentsById(i)}
                        />
                      )} */}
                      </td>
                    </tr>
                    {i.subAssessments.map((s) => (
                      <tr
                        key={i.assessmentCategory.name}
                        className={
                          i.assessmentCategory.id === 14
                            ? 'text-white bg-black'
                            : ''
                        }
                        style={{ cursor: 'pointer' }}
                        onClick={() => ospAssessmentsById(s)}
                      >
                        <td className='px-6 py-4'>
                          <span>{s.assessmentCategory.name}</span>
                        </td>
                        <td className='px-6 py-4'>{s.status.name} </td>
                        <td className='px-6 py-4'>
                          {moment(s.lastUpdateTime).format('DD/MM/yyyy')}{' '}
                        </td>
                        <td className='px-6 py-4 text-center'>
                          {s.assessmentCategory.id !== 14 && (
                            <BackSquare
                              className='view-button'
                              onClick={() => ospAssessmentsById(s)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </details>
        ))
      ) : (
        <Skeleton />
      )}
      {platforms.length === 0 && isLoad && (
        <div className='bg-white p-3 rounded-xl'>
          {' '}
          <Empty description='Kayıtlı Hiç Mağaza Başvurunuz Bulunamadı.' />
        </div>
      )}
      {showModal && (
        <HistoryModal
          showModal={showModal}
          setShowModal={setShowModal}
          notification={notification}
          setNotification={setNotification}
          notificationData={notificationRedirectData}
          data={selectedOspAssessments}
          ospAssessmentsById={() =>
            ospAssessmentsById(selectedOspAssessments.item)
          }
        />
      )}
    </div>
  )
}

export default OnlineSalePlatformsList
