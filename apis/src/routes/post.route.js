const express = require("express")
const router = express.Router()

const postController = require("@controller/post.controller")

router.post("/create", postController.createPost)
router.get("/get-by-community/:communityId", postController.getPostByCommunity)
router.get("/get-all", postController.getAllPost)
router.get("/get-by-id/:id", postController.getPostById)
router.patch("/upvote", postController.upvotePost)
router.patch("/downvote", postController.downvotePost)

module.exports = router
