import { apiClient } from 'modules/core/services'

type RoomInfoType = {
  members: Array<string | null | undefined>
  status: string
  latestMessage: {
    text: string
    createdAt: string
    ownerId: string | null
  }
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
}
