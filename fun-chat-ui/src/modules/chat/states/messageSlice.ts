import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'modules/core/store'
import { fetchHistoryMessageAsync } from './messageActions'
import { IMessageStore } from './type'
import { StatusOfReplyMessage } from '../types/index.d'

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
    replyMessage(state, action) {
      state.replyMsg = action.payload
    },
    cancelReplyMessage(state) {
      state.replyMsg = undefined
    },
    addMessage(state, action) {
      const historyMsgs = state.historyMsgs.msgs
      state.historyMsgs.msgs = [...historyMsgs, action.payload]
    },
    updateMessageInfo(state, action) {
      const updateInfo = action.payload
      const historyMsgs = state.historyMsgs.msgs
      state.historyMsgs.msgs = historyMsgs.map(msg => {
        if (msg._id === updateInfo._id) return { ...msg, ...updateInfo }
        return msg
      })
    },
    updateMessageInfos(state, action) {
      const ids = action.payload

      const historyMsgs = state.historyMsgs.msgs
      state.historyMsgs.msgs = historyMsgs.map(msg => {
        if (ids.includes(msg._id))
          return { ...msg, statusOfReplyMessage: StatusOfReplyMessage.REMOVE }
        return msg
      })
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
  selectReplyMessage: (state: RootState) => state.message.replyMsg,
}

export const {
  addMessage,
  replyMessage,
  cancelReplyMessage,
  updateStatusMessage,
  updateStatusMessages,
  updateMessageInfo,
  updateMessageInfos,
} = messageSlice.actions

export default messageSlice.reducer
