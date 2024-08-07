const express = require("express")
const router = express.Router()
const verify_user = require("../middelware/verify_user")

const userController = require("@controller/user.controller")

router.post("/login", userController.login)
router.get("/", verify_user, userController.verifyUser)
router.get("/search", verify_user, userController.search)
router.get("/getUserById/:userId", verify_user, userController.getUser)

module.exports = router
