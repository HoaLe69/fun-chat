import { apiClient } from 'modules/core/services'

export const authServices = {
  async login({ email, password }: { email: string; password: string }) {
    const res = await apiClient.post('/auth/login/email', { email, password })
    return res.data
  },
  async getOTP(email: string) {
    const res = await apiClient.post('/auth/register/otp', { email })
    return res.data
  },
  async checkEmailAbleToUse(email: string) {
    const res = await apiClient.post('/auth/check/email', { email })
    return res
  },
  async verifyEmail(code: string) {
    const res = await apiClient.post('/auth/register/activeEmail', { code })
    return res
  },
  async registerWithEmail({
    ...args
  }: {
    email: string
    password: string
    display_name: string
    token: string
    otp: string
  }) {
    const res = await apiClient.post('/auth/register/email', {
      ...args,
    })
    return res
  },
  async verifyUser() {
    const res = await apiClient.get('/users')
    return res.data
  },
  async refreshToken() {
    await apiClient.post('/auth/refreshToken')
  },
  async loginWithSocial({
    code,
    platform,
  }: {
    code: string
    platform?: string
  }) {
    const res = await apiClient.post(`/auth/login/${platform}`, { code })

    return res.data
  },
  async logOut() {
    const res = await apiClient.post('/auth/logOut')
    return res
  },
}
