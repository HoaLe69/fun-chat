import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'modules/core/store'
import { fetchHistoryMessageAsync } from './messageActions'
import { IMessageStore } from './type'

const initialState: IMessageStore = {
  historyMsgs: {
    status: 'idle',
    msgs: [],
  },
  modal: {
    isOpenMessageImageGallery: false,
  },
}
const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    openMessageImageGallery(state) {
      state.modal.isOpenMessageImageGallery = true
    },
    closeMessageImageGallery(state) {
      state.modal.isOpenMessageImageGallery = false
    },

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

    removeMessage(state, action) {
      const deleted = action.payload
      state.historyMsgs.msgs = state.historyMsgs.msgs.map((msg) => {
        if (msg?._id === deleted?._id) return { ...msg, isDeleted: true }
        return msg
      })
    },

    removeReplyMessage(state, action) {
      const ids = action.payload

      const historyMsgs = state.historyMsgs.msgs
      //@ts-ignore
      state.historyMsgs.msgs = historyMsgs.map((msg) => {
        if (ids.includes(msg._id)) return { ...msg, replyTo: { ...msg.replyTo, isDeleted: true } }
        return msg
      })
    },

    updateMessageReaction(state, action) {
      const updateInfo = action.payload
      const historyMsgs = state.historyMsgs.msgs
      state.historyMsgs.msgs = historyMsgs.map((msg) => {
        if (msg._id === updateInfo._id) return { ...msg, react: updateInfo.react }
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
  selectHistoryMsgsStatus: (state: RootState) => state.message.historyMsgs.status,
  selectStatusHistoryMsgs: (state: RootState) => state.message.historyMsgs.status,
  selectReplyMessage: (state: RootState) => state.message.replyMsg,
  selectStateModalMesssageGallery: (state: RootState) => state.message.modal.isOpenMessageImageGallery,
}

export const {
  addMessage,
  replyMessage,
  removeMessage,
  removeReplyMessage,
  cancelReplyMessage,
  updateStatusMessage,
  updateStatusMessages,
  updateMessageReaction,
  openMessageImageGallery,
  closeMessageImageGallery,
} = messageSlice.actions

export default messageSlice.reducer
