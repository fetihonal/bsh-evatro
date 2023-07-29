import axiosinstance from '../utils/axios'
// eslint-disable
// eslint-disable-next-line import/prefer-default-export
export const setAuthorizationToken = (token) => {
  if (token) {
    localStorage.setItem('jwtToken', token)
    axiosinstance.defaults.headers.common.Authentication = `${token}`
  } else delete axiosinstance.defaults.headers.common.Authentication
}
