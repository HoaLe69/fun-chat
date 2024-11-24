import { apiClient } from 'modules/core/services'

export const userServices = {
  /**
   *@param {string} q user email
   * **/
  async searchUser({ q }: { q: string }) {
    const res = await apiClient.get(`/users/search?q=${q}`)
    return res.data
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
