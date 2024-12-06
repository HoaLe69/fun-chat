import { createAsyncThunk } from '@reduxjs/toolkit'
import { commentServices } from '../services'

export const fetchHistoryCommentAsync = createAsyncThunk<any, { postId: string }>(
  '/comment/list',
  async ({ postId }) => {
    try {
      const comment = await commentServices.getCommentByPostIdAsync(postId)
      return comment
    } catch (err) {
      console.log(err)
    }
  },
)

type ICreateCommentPayload = {
  ownerId: string
  content: string
  postId: string
  replyTo?: string | null
  root: boolean
  depth?: number | null
}

export const createCommentAsync = createAsyncThunk<any, { rootId?: string; formData: ICreateCommentPayload }>(
  '/comment/create',
  async ({ formData, rootId }) => {
    const createdComment = await commentServices.createComment(formData)
    return { comment: { ...createdComment, depth: formData?.depth }, rootId }
  },
)
