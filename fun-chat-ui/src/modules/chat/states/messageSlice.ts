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
    updateMessageReaction(state, action) {
      const updateInfo = action.payload
      const historyMsgs = state.historyMsgs.msgs
      state.historyMsgs.msgs = historyMsgs.map((msg) => {
        if (msg._id === updateInfo._id)
          return { ...msg, react: updateInfo.react }
        return msg
      })
    },
    updateReplyMessageRemoved(state, action) {
      const ids = action.payload

      const historyMsgs = state.historyMsgs.msgs
      //@ts-ignore
      state.historyMsgs.msgs = historyMsgs.map((msg) => {
        if (ids.includes(msg._id))
          return { ...msg, replyTo: { ...msg.replyTo, isDeleted: true } }
        return msg
      })
    },
    removeMessage(state, action) {
      const updateInfo = action.payload
      const historyMsgs = state.historyMsgs.msgs
      state.historyMsgs.msgs = historyMsgs.map((msg) => {
        if (msg._id === updateInfo._id)
          return { ...msg, isDeleted: updateInfo.isDeleted }
        return msg
      })
    },
    updateStatusMessage(state, action) {
      const { _id, status } = action.payload
      const historyMsgs = state.historyMsgs.msgs
      state.historyMsgs.msgs = [...historyMsgs].map((msg) => {
        if (msg?._id === _id) return { ...msg, status }
        return msg
      })
    },
    updateStatusMessages(state, action) {
      const { msgs: unSeenMsgs, status } = action.payload
      const historyMsgs = state.historyMsgs.msgs
      state.historyMsgs.msgs = historyMsgs.map((msg) => {
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
      .addCase(fetchHistoryMessageAsync.pending, (state) => {
        state.historyMsgs.status = 'loading'
      })
      .addCase(fetchHistoryMessageAsync.fulfilled, (state, action) => {
        state.historyMsgs.status = 'successful'
        state.historyMsgs.msgs = action.payload
      })
      .addCase(fetchHistoryMessageAsync.rejected, (state) => {
        state.historyMsgs.status = 'failure'
      })
  },
})
export const messageSelector = {
  selectHistoryMsgs: (state: RootState) => state.message.historyMsgs.msgs,
  selectHistoryMsgsStatus: (state: RootState) =>
    state.message.historyMsgs.status,
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
  updateMessageReaction,
  updateReplyMessageRemoved,
  removeMessage,
} = messageSlice.actions

export default messageSlice.reducer
