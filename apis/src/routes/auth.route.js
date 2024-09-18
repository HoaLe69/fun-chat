const express = require("express")
const router = express.Router()

const authController = require("@controller/auth.controller")

router.post("/login", authController.login)
router.get("/logOut", authController.logOut)

router.get("/refreshToken", authController.refreshToken)

module.exports = router
