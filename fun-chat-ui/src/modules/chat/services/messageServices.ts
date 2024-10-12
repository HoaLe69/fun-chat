import { apiClient } from 'modules/core/services'

type MessageRequest = {
  roomId: string
  ownerId: string | null
  text: string
}

export const messageServices = {
  async getHistoryMessage(roomId: string) {
    const res = await apiClient.get(`message/list/${roomId}`)
    return res.data
  },
  async createMessage(messageInfo: MessageRequest) {
    const res = await apiClient.post('/message/create', { ...messageInfo })
    return res.data
  },

  async updateMessage({
    type,
    data,
  }: {
    type: string
    data: {
      messageId?: string
      ownerId?: string
      emoji?: string
    }
  }) {
    try {
      let res
      if (type == 'react') {
        res = await apiClient.patch(`/message/${type}/${data.messageId}`, {
          react: {
            ownerId: data.ownerId,
            emoji: data.emoji,
          },
        })
      } else if (type == 'recall') {
        res = await apiClient.patch(`/message/${type}/${data.messageId}`)
      }
      return res
    } catch (error) {
      console.error(error)
    }
  },
}
