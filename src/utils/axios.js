import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
})
instance.CancelToken = axios.CancelToken
instance.isCancel = axios.isCancel
if (localStorage.getItem('jwtToken'))
  instance.defaults.headers.common.Authentication = `${localStorage.getItem(
    'jwtToken'
  )}`
axios.defaults.headers.common.Authentication = `${localStorage.getItem(
  'jwtToken'
)}`
instance.defaults.headers.common['Application-Signature'] =
  'XcLtugfMwgeThiGcyB+mcahxswk='
instance.defaults.headers.common['Accept'] = 'application/json'
instance.defaults.headers.common['Content-Type'] = 'application/json'
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const {
      config,
      response: { status },
    } = error
    const originalRequest = config

    if (status === 401) {
     
    }

    return Promise.reject(error)
  }
)
export default instance
