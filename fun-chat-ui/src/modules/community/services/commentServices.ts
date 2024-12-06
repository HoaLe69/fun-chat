import { apiClient } from 'modules/core/services'

export const commentServices = {
  async createComment(formData: {
    ownerId: string
    content: string
    postId: string
    replyTo?: string | null
    root: boolean
  }) {
    const response = await apiClient.post('/comment/create', formData)
    return response.data
  },
  async getCommentByPostIdAsync(postId: string) {
    const response = await apiClient.get(`/comment/get-by-post-id/${postId}`)
    return response.data
  },
  async upvoteCommentAsync(commentId: string, userId: string) {
    const response = await apiClient.patch('/comment/upvote', { commentId, userId })
    return response.data
  },
  async downvoteCommentAsync(commentId: string, userId: string) {
    const response = await apiClient.patch('/comment/downvote', { commentId, userId })
    return response.data
  },
}
