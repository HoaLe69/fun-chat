import { apiClient } from 'modules/core/services'

export const communityServices = {
  async createCommunity(formData: FormData) {
    const response = await apiClient.post('/community/create', formData)
    return response.data
  },
  async getCommunityByName(name: string) {
    const response = await apiClient.get(`/community/${name}`)
    return response
  },
}
