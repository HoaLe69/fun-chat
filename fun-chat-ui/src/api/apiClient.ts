import axios from 'axios'
import { VITE_API_URL } from '../const'

export const apiClient = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
})
