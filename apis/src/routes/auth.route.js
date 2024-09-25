const express = require("express")
const router = express.Router()

const authController = require("@controller/auth.controller")
const responseAndSaveToken = require("@middleware/responseAndSaveToken")

router.post("/login", authController.login)
router.post("/login/fb", authController.loginWithFacebook, responseAndSaveToken)
router.get("/logOut", authController.logOut)

router.post("/refreshToken", authController.refreshToken)

module.exports = router
