import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from './apiClient'

export const verifyAsync = createAsyncThunk<any, void>(
  '/user/verify',
  async () => {
    const res = await apiClient.get('/users')
    return res.data
  },
)
