import { apiClient } from 'modules/core/services'

type PostForm = {
  title: string
  content: string
  community: string
  creator: string
}
export const postServices = {
  async addUserRecentPostAsync(postId: string, userId: string) {
    const response = await apiClient.post('/post/add-user-recent', { postId, userId })
    console.log({ response })
    return response.data
  },
  async getListPostByCreatorId(userId: string, page: number) {
    const response = await apiClient.get(`/post/get-by-creator-id/${userId}?page=${page}`)
    return response.data
  },
  async getRecentPostVisitedAsync(userId: string) {
    const response = await apiClient.get(`/post/recent/${userId}`)
    return response.data
  },
  async createPost(postForm: PostForm) {
    const response = await apiClient.post('/post/create', postForm)
    return response.data
  },
  async getPostByCommunityId(communityId: string, page: number) {
    const response = await apiClient.get(`/post/get-by-community/${communityId}?page=${page}`)
    return response.data
  },
  async getAllPostPopulateCommunity(page: number) {
    const response = await apiClient.get(`/post/get-all?page=${page}`)
    return response.data
  },
  async getPostById(id: string) {
    const response = await apiClient.get(`/post/get-by-id/${id}`)
    return response.data
  },
  async approvePostAsync(postId: string) {
    const response = await apiClient.patch(`/post/approve/${postId}`)
    return response.data
  },
  async getPendingPostByCommunityId(communityId: string) {
    const response = await apiClient.get(`/post/get-pending-post/${communityId}`)
    return response.data
  },
  async getPostByIdPopulateCommunity(id: string) {
    const response = await apiClient.get(`/post/get-by-id-populate-community/${id}`)
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
  async editPostContentAsync(postId: string, content: string) {
    const response = await apiClient.patch(`/post/edit-content/${postId}`, { content })
    return response.data
  },
  async deletePostByIdAsync(postId: string) {
    const response = await apiClient.delete(`/post/delete/${postId}`)
    return response.data
  },
  async savedPostAsync(postId: string, userId: string) {
    const response = await apiClient.patch(`/post/save/${postId}`, { postId, userId })
    return response.data
  },

  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/post/upload', formData)
    return response.data
  },
}
