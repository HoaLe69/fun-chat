import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from './apiClient'

export const verifyAsync = createAsyncThunk<any, void>(
  '/user/verify',
  async () => {
    const res = await apiClient.get('/users')
    return res.data
  },
)

export const searchUser = createAsyncThunk<
  any,
  { email: string; userId: string | null }
>('user/search', async ({ email, userId }) => {
  // await new Promise(resolve => {
  //   setTimeout(resolve, 3000)
  // })
  const res = await apiClient.get(
    `/users/search?email=${email}&userId=${userId}`,
  )
  return res.data
})
