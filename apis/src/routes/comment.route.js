const express = require("express")
const router = express.Router()

const commentController = require("@controller/comment.controller")

router.post("/create", commentController.createComment)
router.get("/get-by-post-id/:postId", commentController.getCommentByPostId)
router.patch("/upvote", commentController.upvoteComment)
router.patch("/downvote", commentController.downvoteComment)

module.exports = router
