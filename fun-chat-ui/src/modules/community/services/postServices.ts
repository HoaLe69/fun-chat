import { apiClient } from 'modules/core/services'

type PostForm = {
  title: string
  content: string
  community: string
  creator: string
}
export const postServices = {
  async createPost(postForm: PostForm) {
    const response = await apiClient.post('/post/create', postForm)
    return response.data
  },
  async getPostByCommunityId(communityId: string) {
    const response = await apiClient.get(`/post/get-by-community/${communityId}`)
    return response.data
  },
  async getAllPost() {
    const response = await apiClient.get('/post/get-all')
    return response.data
  },
  async getPostById(id: string) {
    const response = await apiClient.get(`/post/get-by-id/${id}`)
    return response.data
  },
  async upvotePost(postId: string, userId: string) {
    const response = await apiClient.patch('/post/upvote', { postId, userId })
    return response.data
  },
  async downvotePost(postId: string, userId: string) {
    const response = await apiClient.patch('/post/downvote', { postId, userId })
    return response.data
  },
}
