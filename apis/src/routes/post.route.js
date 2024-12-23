const express = require("express")
const router = express.Router()

const postController = require("@controller/post.controller")

router.post("/create", postController.createPost)
router.get("/get-by-community/:communityId", postController.getPostByCommunity)
router.get("/get-all", postController.getAllPost)
router.get("/get-by-id/:id", postController.getPostById)
router.get("/get-by-creator-id/:userId", postController.getListPostByCreatorId)
router.patch("/upvote", postController.upvotePost)
router.patch("/downvote", postController.downvotePost)
router.get("/recent/:userId", postController.getUserRecentPostsVisited)
router.post("/add-user-recent", postController.addUserRecentPostVisited)
router.patch("/edit-content/:postId", postController.updatePostContent)

module.exports = router
