import { apiClient } from 'modules/core/services'

type RoomInfoType = {
  members: Array<string | null | undefined>
  status: string
}
export const roomServices = {
  async createRoom(roomInfo: RoomInfoType) {
    const res = await apiClient.post('/room/create', { ...roomInfo })
    return res.data
  },
  async getListRoomByUserId(userId: string) {
    const res = await apiClient.get(`/room/list/${userId}`)
    return res.data
  },
  async checkRoomExistAsync(members: Array<string>) {
    const [first, second] = members

    const res = await apiClient.get(`/room/check-room`, {
      params: {
        first,
        second,
      },
    })
    return res.data
  },
  async markAsRead(roomId: string, userId: string) {
    const response = await apiClient.patch('/room/mark-as-read', { roomId, userId })
    return response.data
  },
}
