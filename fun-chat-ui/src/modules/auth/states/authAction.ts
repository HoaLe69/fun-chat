import { createAsyncThunk } from '@reduxjs/toolkit'
import { authServices } from 'modules/auth/services/authServices'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const verifyUserAsync = createAsyncThunk<any, void>('/auth/verify', async () => {
  try {
    const res = await authServices.verifyUser()
    return res
  } catch (err) {
    throw new Error('Something went wrong')
  }
})
