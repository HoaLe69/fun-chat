import { apiClient } from 'modules/core/services'

export const notifyServices = {
  async createNotify(data: any) {
    const response = await apiClient.post('/notify/push', { ...data })
    return response.data
  },
  async getNotifies(userId: string) {
    const response = await apiClient.get(`/notify/get/${userId}`)
    return response.data
  },
  async readNotificationAsync(notificationId: string) {
    const response = await apiClient.patch(`/notify/mark-as-read/${notificationId}`)
    return response.data
  },
}
