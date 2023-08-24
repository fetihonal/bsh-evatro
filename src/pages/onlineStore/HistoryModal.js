import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, message } from 'antd'
import fileDownload from 'js-file-download'
import { ArchiveTick, ClipboardClose, MessageSearch } from 'iconsax-react'

import {
  AiFillFilePdf,
  AiFillFileImage,
  AiFillFileExcel,
  AiFillFileWord,
  AiFillFileUnknown,
} from 'react-icons/ai'

import moment from 'moment'
import instance from '../../utils/axios'
const HistoryModal = (props) => {
  const { data, notification, setNotification, notificationData } = props
  const [histoyData, setHistoryData] = useState([])
  const [saveView, setSaveView] = useState(true)
  const [activeId, setActiveId] = useState()
  const [activeName, setActiveName] = useState('')
  const [description, setDescription] = useState('')
  useEffect(() => {
    if (props.showModal) {
      if (data.item) {
        getHistoryData(data.item.id)
        setActiveId(data.item.id)
      }
    }
  }, [props.showModal])
  // useEffect(() => {
  //   if (notification) {
  //     setActiveId(Number(notificationData.assessmentHistoryId));
  //     getHistoryData(notificationData.assessmentHistoryId);
  //   }
  // }, [notification]);

  const getHistoryData = (id) => {
    instance
      .post(`osp_assessment_history?OspAssessmentId=${id}`)
      .then((res) => {
        setHistoryData(res.data)
      })
  }

  const saveAssessment = (id) => {
    if (description !== '') {
      instance
        .post('/save_osp_assessment', {
          ospAssessmentId: activeId,
          description,
        })
        .then((res) => {
          setHistoryData([])
          setSaveView(false)
          setDescription('')
          props.ospAssessmentsById(activeId)
          getHistoryData(activeId)
          message.success('Geribildirim başarıyla gönderildi.')
        })
        .catch((err) => {
          setHistoryData([])
          setSaveView(false)
          setDescription('')
          props.ospAssessmentsById(activeId)
          getHistoryData(activeId)

          message.error('Geribildirim kayıt ederken bir hata oluştu.')
        })
    } else {
      message.error('Geribildirim alanını boş bırakmayınız.')
    }
  }
  const [isDownloading, setIsDownloading] = useState(false)
  const handleDownload = (fileUrl, fileName) => {
    setIsDownloading(true)
    message.info('İndirme İşlemi Başlatıldı')
    instance
      .get(fileUrl, {
        responseType: 'blob',
      })
      .then((res) => {
        fileDownload(res.data, fileName)
        message.success('İndirme İşlemi Tamamlandı')
      })
    setIsDownloading(false)
  }
  const fileType = (fileName) => {
    const extension = fileName.split('.').pop()
    switch (extension) {
      case 'pdf':
        return <AiFillFilePdf />
        break
      case 'xlsx':
      case 'xls':
        return <AiFillFileExcel />
        break
      case 'png':
        return <AiFillFileImage />
        break
      case 'jpg':
      case 'jpeg':
        return <AiFillFileImage />
        break
      case 'docx':
        return <AiFillFileWord />
        break
      default:
        return <AiFillFileUnknown />
        break
    }
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
      {props.showModal && (
        <Modal
          open={props.showModal}
          title={
            <h2>
              {!notification ? (
                <strong>
                  {data.item.assessmentCategory.name}{' '}
                  {activeName !== '' ? `/ ${activeName}` : ''}
                </strong>
              ) : (
                <strong>{notificationData.title}</strong>
              )}
            </h2>
          }
          onCancel={() => {
            props.setShowModal(false)
            setNotification(false)
          }}
          width={'60%'}
          footer={[]}
        >
          <div className='modal-content border-0'>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-10'>
              <thead className='text-xs text-gray-700 uppercase border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400'>
                <th scope='col' className='px-6 py-3'>
                  Geribildirim Tarihi
                </th>
                <th scope='col' className='px-6 py-3'>
                  Son Durum
                </th>
                <th scope='col' className='px-6 py-3'>
                  Açıklama
                </th>
                <th scope='col' className='px-6 py-3 text-center'>
                  Ekler
                </th>
              </thead>
              <tbody>
                {histoyData.length > 0 ? (
                  histoyData.map((i) => (
                    <tr className='bg-white  hover:bg-gray-300 transition-all rounded-lg dark:border-gray-700 cursor-pointer'>
                      <th
                        scope='row'
                        className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                      >
                        {moment(i.lastUpdateTime).format('DD/MM/yyyy')}
                      </th>
                      <td className='px-6 py-4 text-center'>
                        {checkStatus(i.status.id)}
                      </td>
                      <td className='px-6 py-4 '>
                        {i.description ? i.description : ''}
                      </td>
                      <td className='px-6 py-4 text-center'>
                        {i.ospAssessmentFiles.length > 0
                          ? i.ospAssessmentFiles.map((file) => (
                              <>
                                <div
                                  className='flex gap-2 items-center justify-center '
                                  style={{ fontSize: 18 }}
                                >
                                  <span
                                    className='border p-2 rounded-full mb-1 bg-gra-500 text-primary'
                                    onClick={() =>
                                      handleDownload(
                                        process.env
                                          .REACT_APP_DYNAMIC_IMAGES_URL +
                                          localStorage.getItem('jwtToken') +
                                          '/osp/' +
                                          file.fileName,
                                        file.fileName
                                      )
                                    }
                                  >
                                    {fileType(file.fileName)}
                                  </span>
                                </div>
                              </>
                            ))
                          : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <div className='p-3 border text-center w-full text-lg'>
                    İşlem geçmişi bulunmamaktadır.
                  </div>
                )}
              </tbody>
            </table>
            {data.item.status.id === 3 && saveView && (
              <div className='border p-3 rounded-xl mt-10 bg-primary text-white'>
                <div className='col-md-12 mb-2'>
                  <h2>Geri Bildirim</h2>
                </div>
                <div className='inputTextBox input-group col-12'>
                  <Input
                    placeholder='Geri bildirim notunuz.'
                    className='form-control'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div class='w-full text-right mt-3'>
                    <Button
                      type='dashed'
                      className='input-group-text imgButtonBoxBorder'
                      id='basic-addon2'
                      onClick={() => saveAssessment()}
                    >
                      Uygunluk kontrolü için gönder
                      <i className='bx bx-send ml-2'></i>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
export default HistoryModal
