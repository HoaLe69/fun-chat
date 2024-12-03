const postServices = require("@services/postServices")

const postController = {
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
      const posts = await postServices.getPostByCreator(id)
      res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  },
  async getAllPost(req, res, next) {
    try {
      const posts = await postServices.getAllPost()
      return res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  },
  async getPostByCommunity(req, res, next) {
    try {
      const communityId = req.params.communityId
      const posts = await postServices.getPostByCommunity(communityId)
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
