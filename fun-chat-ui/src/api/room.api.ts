import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from './apiClient'

export const createRoomAsync = createAsyncThunk<
  any,
  { room: { members: Array<string | null> } }
>('/room/create', async ({ room }) => {
  try {
    const res = await apiClient.post('/channel/create', { ...room })
    return res.data
  } catch (err) {
    console.log(err)
  }
})

export const fetchListRoomAsync = createAsyncThunk<
  any,
  { userLoginId: string }
>('/channel/list', async ({ userLoginId }) => {
  try {
    const res = await apiClient.get(`/channel/list/${userLoginId}`)
    return res.data
  } catch (err) {
    console.log(err)
  }
})
