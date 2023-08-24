import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { Eye, ArchiveTick, ClipboardClose, MessageSearch } from 'iconsax-react'
import instance from '../../utils/axios'

import moment from 'moment'
const NotificationModal = (props) => {
  const { data, showModal, setShowModal, notificationRedirect } = props
  const [platforms, setPlatforms] = useState([])

  useEffect(() => {
    async function fetchPlatforms() {
      try {
        instance.post('/osp').then((res) => {
          setPlatforms(res.data)
        })
      } catch (error) {
        console.error(error)
      }
    }
    if (showModal) fetchPlatforms()
  }, [showModal])

  const platFormName = (entityId) => {
    let name = ''
    name = platforms.filter((i) => i.id === entityId)
    return name
  }
  const save = (res) => {
    res.unread = false
    res.deleted = true
    const historyId = res.notificationModal.notificationContent.text.split(',')
    instance.post('/save_entity?TableName=NotificationInbox', res).then(() => {
      notificationRedirect(
        res.notificationModal.entityId,
        historyId[1],
        historyId[2],
        res.notificationModal.notificationContent.title,
        historyId[3]
      )
      setShowModal(false)
    })
  }
  const checkStatus = (id) => {
    if (id == 2) {
      return <ArchiveTick className='text-green-600' />
    }
    if (id == 3) {
      return <ClipboardClose className='text-red-600' />
    }
    if (id == 1) {
      return <MessageSearch className='text-gray-500' />
    }
  }
  return (
    <div>
      <Modal
        open={props.showModal}
        title='Pazaryeri Bildirimleri'
        onCancel={() => props.setShowModal(false)}
        width={'max-content'}
        footer={[]}
      >
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-10'>
          <thead className='text-xs text-gray-700 uppercase border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400'>
            <th scope='col' className='px-6 py-3'>
              Pazaryeri Adı
            </th>
            <th scope='col' className='px-6 py-3'>
              Durum
            </th>
            <th scope='col' className='px-6 py-3'>
              Bildirim Tarihi
            </th>
            <td scope='col' className='px-6 py-3 text-center'>
              İşlem
            </td>
          </thead>
          <tbody>
            {data.map(
              (res) =>
                res.unread && (
                  <tr className='bg-white  hover:bg-gray-300 transition-all rounded-lg dark:border-gray-700 cursor-pointer'>
                    <td
                      scope='row'
                      className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                    >
                      {res.notificationModal.notificationContent.title}
                    </td>
                    <td className='px-6 py-4'>
                      {checkStatus(
                        res.notificationModal.notificationContent.text.split(
                          ','
                        )[3]
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      {moment(
                        res.notificationModal.notificationCreatedDate
                      ).format('DD/MM/yyyy')}
                    </td>
                    <td className='px-6 py-4'>
                      <Eye className='view-button' onClick={() => save(res)} />
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </Modal>
    </div>
  )
}
export default NotificationModal
