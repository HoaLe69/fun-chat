import { createSlice } from '@reduxjs/toolkit'
import { searchUser, verifyAsync } from '../api/user.api'
import { RootState } from './store'

const initialState = {
  user: {
    _id: null,
    display_name: null,
    picture: null,
    email: null,
  },
  isAuthenticated: null,
  search: {
    loading: false,
    result: [],
  },
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(verifyAsync.rejected, state => {
        //@ts-ignore
        state.isAuthenticated = false
        window.location.href = '/login'
      })
      .addCase(verifyAsync.fulfilled, (state, action) => {
        state.user = action.payload
        //@ts-ignore
        state.isAuthenticated = true
      })
      .addCase(searchUser.pending, state => {
        state.search.loading = true
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.search.loading = false
        state.search.result = action.payload
      })
      .addCase(searchUser.rejected, state => {
        state.search.loading = false
      })
  },
})

export const userSelector = {
  selectUser: (state: RootState) => state.user.user,
  selectAuthenticated: (state: RootState) => state.user.isAuthenticated,
  selectLoadingSearch: (state: RootState) => state.user.search.loading,
  selectSearchResult: (state: RootState) => state.user.search.result,
}
export default userSlice.reducer
