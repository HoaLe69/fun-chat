import { apiClient } from 'modules/core/services'

export const userServices = {
  async searchUser({ q, userId }: { q: string; userId: string }) {
    try {
      const res = await apiClient.get(`/users/search?q=${q}&userId=${userId}`)
      return res.data
    } catch (error) {
      console.log(error)
    }
  },

  async getUserById(userId: string | undefined) {
    try {
      const res = await apiClient.get(`/users/getUserById/${userId}`)
      return res.data
    } catch (error) {
      console.log(error)
    }
  },
}
