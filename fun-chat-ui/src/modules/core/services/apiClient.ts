import axios from 'axios'
import { VITE_API_URL } from 'const'

export const apiClient = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config

    // if error is 403 and not already retried
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true // mark request as already retried

      // send refresh token request (stored in a cookie , automatically attached)
      try {
        await apiClient.get('/auth/refreshToken')
        return apiClient(originalRequest)
      } catch (error) {
        console.log('Token refresh failed , logging out')
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)
