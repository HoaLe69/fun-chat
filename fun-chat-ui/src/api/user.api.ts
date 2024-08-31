import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from './apiClient'

export const verifyAsync = createAsyncThunk<any, void>(
  '/user/verify',
  async () => {
    try {
      const res = await apiClient.get('/users')
      return res.data
    } catch (err) {
      throw new Error('Something went wrong')
      console.error(err)
    }
  },
)

export const searchUser = async ({
  q,
  userId,
}: {
  q: string
  userId: string
}) => {
  try {
    const res = await apiClient.get(`/users/search?q=${q}&userId=${userId}`)
    return res.data
  } catch (err) {
    console.log(err)
  }
}

export const fetchUser = async (userId: string | undefined) => {
  try {
    const res = await apiClient.get(`/users/getUserById/${userId}`)
    return res.data
  } catch (err) {
    console.log(err)
  }
}
