const commentServices = require("@services/commentServices")
const commentController = {
  async createComment(req, res, next) {
    try {
      const comment = await commentServices.createCommentAsync(req.body)
      return res.status(200).json(comment)
    } catch (error) {
      next(error)
    }
  },
  async getCommentByPostId(req, res, next) {
    try {
      const postId = req.params.postId
      const comments = await commentServices.getCommentByPostIdAsync(postId)
      return res.status(200).json(comments)
    } catch (error) {
      next(error)
    }
  },
  async upvoteComment(req, res, next) {
    try {
      const { commentId, userId } = req.body
      const comment = await commentServices.upvoteCommentAsync(commentId, userId)
      return res.status(200).json(comment)
    } catch (error) {
      next(error)
    }
  },
  async downvoteComment(req, res, next) {
    try {
      const { commentId, userId } = req.body
      const comment = await commentServices.downvoteCommentAsync(commentId, userId)
      return res.status(200).json(comment)
    } catch (error) {
      next(error)
    }
  },
}

module.exports = commentController
