import { apiClient } from 'modules/core/services'

type MessageRequest = {
  roomId: string
  ownerId: string | null
  text: string
}

export const messageServices = {
  async getMessageLinkPreviewMetadata(links: Array<string | null>, msgId: string) {
    const response = await apiClient.post('/message/link/preview', { links, msgId })
    return response
  },
  async downloadFile(filename?: string) {
    if (!filename) return
    const response = await apiClient.post(`/message/download/${filename}`)
    return response
  },
  async uploadFiles(files: File[]) {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    console.log({ formData })
    const response = await apiClient.post('/message/uploads', formData)
    return response.data
  },
  async getMessageById(msgId: string) {
    const res = await apiClient.get('/message', {
      params: {
        id: msgId,
      },
    })
    return res.data
  },
  async getHistoryMessage(roomId: string) {
    const res = await apiClient.get(`message/list/${roomId}`)
    return res.data
  },
  async createMessage(formData: FormData) {
    try {
      const res = await apiClient.post('/message/create', formData)
      return res.data
    } catch (error) {
      console.log(error)
    }
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
