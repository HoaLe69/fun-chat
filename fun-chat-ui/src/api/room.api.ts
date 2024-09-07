import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from './apiClient'

export const createRoomAsync = async ({
  room,
}: {
  room: {
    members: Array<string>
    status: string
    latestMessage: {
      text: string
      createdAt: string
      ownerId: string
    }
  }
}) => {
  try {
    const res = await apiClient.post('/room/create', { ...room })
    return res
  } catch (err) {
    console.log(err)
  }
}

export const fetchListRoomAsync = createAsyncThunk<
  any,
  { userLoginId: string }
>('/room/list', async ({ userLoginId }) => {
  try {
    const res = await apiClient.get(`/room/list/${userLoginId}`)
    return res.data
  } catch (err) {
    console.log(err)
  }
})
