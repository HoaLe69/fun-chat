import { createSlice } from '@reduxjs/toolkit'
import { verifyAsync } from '../api/user.api'
import { RootState } from './store'

type UserStore = {
  user?: {
    id: string
    name: string
    display_name: string
    email: string
    picture: string
  }
  isAuthenticated?: boolean
}
const initialState: UserStore = {}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(verifyAsync.rejected, state => {
        state.isAuthenticated = false
        window.location.href = '/login'
      })
      .addCase(verifyAsync.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
      })
  },
})

export const userSelector = {
  selectUser: (state: RootState) => state.user.user,
  selectAuthenticated: (state: RootState) => state.user.isAuthenticated,
}
export default userSlice.reducer
