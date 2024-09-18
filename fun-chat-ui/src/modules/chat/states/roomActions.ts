import { createAsyncThunk } from '@reduxjs/toolkit'
import { roomServices } from '../services/roomServices'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchListRoomAsync = createAsyncThunk<any, { userId: string }>(
  '/room/list',
  async ({ userId }) => {
    try {
      const res = await roomServices.getListRoomByUserId(userId)
      console.log({ res })
      return res
    } catch (err) {
      console.log(err)
    }
  },
)
