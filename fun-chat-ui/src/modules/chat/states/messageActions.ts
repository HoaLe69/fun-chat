import { createAsyncThunk } from '@reduxjs/toolkit'
import { messageServices } from '../services/messageServices'

export const fetchListMessageAsync = createAsyncThunk<
  any,
  { roomId: string | undefined }
>('/message/list', async ({ roomId }) => {
  try {
    const res = await messageServices.getListMessageByRoomId(roomId)
    return res.data
  } catch (err) {
    console.log(err)
  }
})
