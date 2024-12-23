const postServices = require("@services/postServices")

const postController = {
  async updatePostContent(req, res, next) {
    try {
      const postId = req.params.postId
      const { content } = req.body
      const editedPost = await postServices.updatePostContentAsync(postId, content)
      return res.status(200).json(editedPost)
    } catch (error) {
      next(error)
      console.log(error)
    }
  },
  async getListPostByCreatorId(req, res, next) {
    try {
      const userId = req.params.userId
      const page = req.query.page
      const posts = await postServices.getListPostByCreatorIdAsync(userId, page)
      return res.status(200).json(posts)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  async addUserRecentPostVisited(req, res, next) {
    try {
      await postServices.addUserRecentPostVisitedAsync(req.body)
      res.status(204).send("ok")
    } catch (error) {
      next(error)
    }
  },
  async getUserRecentPostsVisited(req, res, next) {
    try {
      const recentPosts = await postServices.getUserRecentPostsVisitedAsync(req.params.userId)
      return res.status(200).json(recentPosts)
    } catch (error) {
      next(error)
    }
  },
  async createPost(req, res, next) {
    try {
      const postInfo = req.body
      const savedPost = await postServices.createPost(postInfo)
      res.status(201).json(savedPost)
    } catch (error) {
      next(error)
    }
  },
  async getPostById(req, res, next) {
    try {
      const id = req.params.id
      const posts = await postServices.getPostPopulateCreatorAsync(id)
      res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  },
  async getAllPost(req, res, next) {
    try {
      const page = req.query.page || 1
      console.log("page", page)
      const posts = await postServices.getAllPost(page)
      return res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  },
  async getPostByCommunity(req, res, next) {
    try {
      const communityId = req.params.communityId
      const { page } = req.query
      const posts = await postServices.getPostByCommunity(communityId, page)
      res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  },

  async upvotePost(req, res, next) {
    try {
      const { postId, userId } = req.body
      const post = await postServices.upvote(postId, userId)
      res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  },
  async downvotePost(req, res, next) {
    try {
      const { postId, userId } = req.body
      const post = await postServices.downvote(postId, userId)
      res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  },
}

module.exports = postController
