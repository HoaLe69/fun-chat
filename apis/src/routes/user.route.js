const express = require("express")
const router = express.Router()

const userController = require("@controller/user.controller")

router.get("/", userController.verifyUser)
router.get("/search", userController.search)
router.get("/getUserById/:userId", userController.getUserById)
router.patch("/add-friend-request", userController.addNewFriendRequest)
router.patch("/accept-friend-request", userController.acceptFriendRequest)
router.patch("/cancel-friend-request", userController.cancelFriendRequest)

module.exports = router
