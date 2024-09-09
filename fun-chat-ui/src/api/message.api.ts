import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from './apiClient'

type MessageRequest = {
  roomId: string
  ownerId: string | null
  text: string
}

export const fetchListMessageAsync = createAsyncThunk<
  any,
  { channelId: string | undefined }
>('/message/list', async ({ channelId }) => {
  try {
    const res = await apiClient.get(`/message/list/${channelId}`)
    return res.data
  } catch (err) {
    console.log(err)
  }
})

export const createMessageAsync = async (reqData: MessageRequest) => {
  try {
    const res = apiClient.post('/message/create', { ...reqData })
    return res
  } catch (err) {
    console.log(err)
  }
}

export const updateMessageAsync = async ({
  type,
  data,
}: {
  type: string
  data: {
    messageId?: string
    ownerId?: string
    emoji?: string
  }
}) => {
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
}
