const postServices = require("@services/postServices")

const postController = {
  async approvePost(req, res, next) {
    try {
      const postId = req.params.postId
      await postServices.approvePostAsync(postId)
      return res.status(204).send("ok")
    } catch (error) {
      next(error)
    }
  },
  async getPendingPost(req, res, next) {
    try {
      const communityId = req.params.id
      const posts = await postServices.getPendingPostByCommunityIdAsync(communityId)
      return res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  },
  async savePost(req, res, next) {
    try {
      const { userId, postId } = req.body
      await postServices.savePostAsync(postId, userId)
      return res.status(204).send("ok")
    } catch (error) {
      next(error)
    }
  },
  async deletePost(req, res, next) {
    try {
      const postId = req.params.postId
      await postServices.deletePostAsync(postId)
      return res.status(204).send("ok")
    } catch (error) {
      next(error)
    }
  },
  async uploadFile(req, res, next) {
    try {
      const uploadedFile = req.file
      const path = `${req.protocol}://${req.get("host")}/uploads/${uploadedFile.filename}`
      return res.status(200).json({ path, fileName: uploadedFile.originalname })
    } catch (error) {
      next(error)
    }
  },
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
  async getPostByIdPopulateCommunity(req, res, next) {
    try {
      const id = req.params.id
      const posts = await postServices.getPostPopulateCommunityAsync(id)
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
