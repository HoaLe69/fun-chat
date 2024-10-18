import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'modules/core/store'
import { fetchHistoryMessageAsync } from './messageActions'
import { IMessageStore } from './type'

const initialState: IMessageStore = {
  historyMsgs: {
    status: 'idle',
    msgs: [],
  },
}
const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage(state, action) {
      const historyMsgs = state.historyMsgs.msgs
      state.historyMsgs.msgs = [...historyMsgs, action.payload]
    },
    updateStatusMessage(state, action) {
      const { _id, status } = action.payload
      const historyMsgs = state.historyMsgs.msgs
      state.historyMsgs.msgs = [...historyMsgs].map(msg => {
        if (msg?._id === _id) return { ...msg, status }
        return msg
      })
    },
    updateStatusMessages(state, action) {
      const { msgs: unSeenMsgs, status } = action.payload
      const historyMsgs = state.historyMsgs.msgs
      state.historyMsgs.msgs = historyMsgs.map(msg => {
        if (unSeenMsgs.includes(msg._id))
          return {
            ...msg,
            status,
          }
        return msg
      })
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchHistoryMessageAsync.pending, state => {
        state.historyMsgs.status = 'loading'
      })
      .addCase(fetchHistoryMessageAsync.fulfilled, (state, action) => {
        state.historyMsgs.status = 'successful'
        state.historyMsgs.msgs = action.payload
      })
      .addCase(fetchHistoryMessageAsync.rejected, state => {
        state.historyMsgs.status = 'failure'
      })
  },
})
export const messageSelector = {
  selectHistoryMsgs: (state: RootState) => state.message.historyMsgs.msgs,
  selectStatusHistoryMsgs: (state: RootState) =>
    state.message.historyMsgs.status,
}

export const { addMessage, updateStatusMessage, updateStatusMessages } =
  messageSlice.actions

export default messageSlice.reducer
