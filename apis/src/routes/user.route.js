const express = require("express")
const router = express.Router()

const userController = require("@controller/user.controller")

router.get("/", userController.verifyUser)
router.get("/search", userController.search)
router.get("/getUserById/:userId", userController.getUserById)

module.exports = router
