const express = require("express")
const router = express.Router()
const upload = require("@config/multer")

const postController = require("@controller/post.controller")

router.post("/create", postController.createPost)
router.get("/get-by-community/:communityId", postController.getPostByCommunity)
router.get("/get-all", postController.getAllPost)
router.get("/get-by-id/:id", postController.getPostById)
router.get("/get-by-id-populate-community/:id", postController.getPostByIdPopulateCommunity)
router.get("/get-pending-post/:id", postController.getPendingPost)
router.get("/get-by-creator-id/:userId", postController.getListPostByCreatorId)
router.patch("/upvote", postController.upvotePost)
router.patch("/downvote", postController.downvotePost)
router.patch("/approve/:postId", postController.approvePost)
router.get("/recent/:userId", postController.getUserRecentPostsVisited)
router.post("/add-user-recent", postController.addUserRecentPostVisited)
router.post("/upload", upload.single("file"), postController.uploadFile)
router.patch("/edit-content/:postId", postController.updatePostContent)
router.delete("/delete/:postId", postController.deletePost)
router.patch("/save/:postId", postController.savePost)

module.exports = router
