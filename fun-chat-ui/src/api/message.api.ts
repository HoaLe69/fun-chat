import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from './apiClient'

type MessageRequest = {
  channel_id: string
  userId: string | null
  content: string
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
