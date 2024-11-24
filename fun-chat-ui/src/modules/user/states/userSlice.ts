import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'modules/core/store'

type IUserStore = {
  usersOnline: Record<string, { status: string }>
}
const initialState: IUserStore = {
  usersOnline: {},
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUsersOnline(state, action) {
      const _userOnlines = action.payload
      state.usersOnline = _userOnlines
    },
  },
  extraReducers: (builder) => {
    builder
  },
})

export const { getUsersOnline } = userSlice.actions

export const userSelector = {
  selectListCurrentUserOnline: (state: RootState) => state.user.usersOnline,
}

export default userSlice.reducer
