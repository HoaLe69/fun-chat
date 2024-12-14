import { createSlice } from '@reduxjs/toolkit'
import type { ICommentStore } from './type'
import { fetchHistoryCommentAsync, createCommentAsync } from './commentActions'

const initialState: ICommentStore = {
  historyComment: {
    status: 'idle',
    data: [],
  },
}
const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createCommentAsync.fulfilled, (state, action) => {
      //todo
      const { comment, rootId } = action.payload
      console.log('store', comment, rootId)

      const _comments = [...state.historyComment.data]

      if (!rootId) {
        state.historyComment.data = [..._comments, { ...comment, replies: [] }]
      } else {
        state.historyComment.data = _comments.map((item) => {
          if (item._id === rootId) {
            return { ...item, replies: [...item.replies, { ...comment, replies: [] }] }
          }
          return item
        })
      }
    })
    builder.addCase(fetchHistoryCommentAsync.pending, (state) => {
      state.historyComment.status = 'loading'
    })
    builder.addCase(fetchHistoryCommentAsync.fulfilled, (state, action) => {
      state.historyComment.status = 'successful'
      state.historyComment.data = action.payload
    })
    builder.addCase(fetchHistoryCommentAsync.rejected, (state) => {
      state.historyComment.status = 'failure'
    })
  },
})

export const commentSelector = {
  selecteHistoryCommentStatus: (state: any) => state.comment.historyComment.status,
  selectHistoryCommentData: (state: any) => state.comment.historyComment.data,
}

export default commentSlice.reducer
