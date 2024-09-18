import { apiClient } from 'modules/core/services'

type LoginPropType = {
  type?: string
  email?: string
  password?: string
  id_token?: string
}
export const authServices = {
  async login(args: LoginPropType) {
    const res = await apiClient.post('auth/login', { ...args })
    return res.data
  },
  async verifyUser() {
    const res = await apiClient.get('/users')
    return res.data
  },
}
