import { apiClient } from 'modules/core/services'

export const communityServices = {
  async createCommunity(formData: FormData) {
    const response = await apiClient.post('/community/create', formData)
    return response.data
  },
  async getCommunityByName(name: string) {
    const response = await apiClient.get(`/community/${name}`)
    return response.data
  },
  async searchCommunity(searchTerm: string) {
    const response = await apiClient.get(`/community/get-list-by-name?name=${searchTerm}`)
    return response.data
  },
  async getCommunityByUser(userId: string) {
    const response = await apiClient.get(`/community/get-list-by-user/${userId}`)
    return response.data
  },
}
