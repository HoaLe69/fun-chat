import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from './apiClient'

export const createRoomAsync = createAsyncThunk<
  any,
  {
    room: {
      members: Array<{ userId: string | null; display_name: string | null }>
      status: string
    }
  }
>('/room/create', async ({ room }) => {
  try {
    const res = await apiClient.post('/room/create', { ...room })
    return res.data
  } catch (err) {
    console.log(err)
  }
})

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
