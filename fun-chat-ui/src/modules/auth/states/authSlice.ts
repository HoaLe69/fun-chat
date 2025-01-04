import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'modules/core/store'
import { verifyUserAsync } from './authAction'
import type { IUser } from 'modules/user/types'

type AuthStore = {
  user?: IUser
  isAuthenticated?: boolean
}

const initialState: AuthStore = {}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut(state) {
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verifyUserAsync.fulfilled, (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    })
    builder.addCase(verifyUserAsync.rejected, (state) => {
      state.isAuthenticated = false
    })
  },
})

export const authSelector = {
  selectUser: (state: RootState) => state.auth.user,
  selectIsAuthenticate: (state: RootState) => state.auth.isAuthenticated,
  selectUserId: (state: RootState) => state.auth.user?._id,
}
export const { logOut } = authSlice.actions
export default authSlice.reducer
