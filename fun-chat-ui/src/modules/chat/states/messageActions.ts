import { createAsyncThunk } from '@reduxjs/toolkit'
import { messageServices } from '../services/messageServices'

export const fetchHistoryMessageAsync = createAsyncThunk<any, string>(
  '/message/hisotry',
  async (roomId) => {
    try {
      if (!roomId) return []
      const res = await messageServices.getHistoryMessage(roomId)
      return res
    } catch (err) {
      console.log(err)
    }
  },
)
