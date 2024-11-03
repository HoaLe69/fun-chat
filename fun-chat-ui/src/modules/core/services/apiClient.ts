import axios from 'axios'
import { authServices } from 'modules/auth/services/authServices'
import { VITE_API_URL } from 'const'

//create an axios instance
export const apiClient = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true, // Ensure cookies are sent with requests
})

let refreshTokenPromise: Promise<void | null> | null = null

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const responseStatus = error.response.status

    // check if the error status is 401 (Unauthorized)
    if (responseStatus === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      // if a refresh tken request is already in progress , wait for it to resolve
      if (!refreshTokenPromise) refreshTokenPromise = authServices.refreshToken()
      try {
        // Await the refresh token promise
        await refreshTokenPromise
        refreshTokenPromise = null

        return apiClient(originalRequest)
      } catch (error) {
        // if refresh token is expires , force log out the user
        window.alert('Your session has expired. You must to log in again.')
        window.location.replace('/login')
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)
