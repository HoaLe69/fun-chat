const express = require("express")
const router = express.Router()

const authController = require("@controller/auth.controller")
const responseAndSaveToken = require("@middleware/responseAndSaveToken")

router.post("/check/email", authController.checkEmailIsExist)
router.post(
  "/register/email",
  authController.registerWithEmail,
  responseAndSaveToken,
)
router.post("/register/otp", authController.sendAnOTP)
router.post("/login/email", authController.loginWithEmail, responseAndSaveToken)
router.post(
  "/login/facebook",
  authController.loginWithFacebook,
  responseAndSaveToken,
)
router.post(
  "/login/google",
  authController.loginWithGoogle,
  responseAndSaveToken,
)
router.post(
  "/login/discord",
  authController.loginWithDiscord,
  responseAndSaveToken,
)
router.get("/logOut", authController.logOut)

router.post("/refreshToken", authController.refreshToken)

module.exports = router
