import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'modules/core/store'
import { fetchListMessageAsync } from './messageActions'

const initialState = {
  list: {
    loading: false,
    msgs: [],
  },
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchListMessageAsync.pending, state => {
        state.list.loading = true
      })
      .addCase(fetchListMessageAsync.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.msgs = action.payload
      })
      .addCase(fetchListMessageAsync.rejected, state => {
        state.list.loading = false
      })
  },
})
export const messageSelector = {
  selectListMessageStatus: (state: RootState) => state.message.list.loading,
  selectListMessage: (state: RootState) => state.message.list.msgs,
}

export default messageSlice.reducer
