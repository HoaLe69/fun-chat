import { apiClient } from 'modules/core/services'

export const communityServices = {
  async createCommunity(formData: FormData) {
    const response = await apiClient.post('/community/create', formData)
    return response.data
  },
  async getRecentCommunityVisitedAsync(userId: string) {
    const response = await apiClient.get(`/community/recent/${userId}`)
    return response.data
  },
  async addUserRecentCommunityAsync(communityId: string, userId: string) {
    const response = await apiClient.post('/community/add-user-recent', { communityId, userId })
    return response.data
  },
  async joinCommunity(communityId: string, userId: string) {
    const response = await apiClient.patch('/community/add-member', { communityId, userId })
    return response.data
  },
  async getCommunityByName(name: string) {
    const response = await apiClient.get(`/community/get-by-name/${name}`)
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
