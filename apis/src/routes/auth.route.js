const express = require("express")
const router = express.Router()

const authController = require("@controller/auth.controller")

router.post("/login", authController.login)
router.get("/logOut", authController.logOut)

router.post("/refreshToken", authController.refreshToken)

module.exports = router
