const express = require("express")
const router = express.Router()

const authController = require("@controller/auth.controller")
const responseAndSaveToken = require("@middleware/responseAndSaveToken")
const authValidator = require("@middleware/validator/authValidator")
const requireAuth = require("@middleware/requireAuth")

router.post("/check/email", authController.checkEmailIsExist)
router.post("/register/otp", authController.sendAnOTP)
router.post(
  "/register/email",
  authValidator.registerValidation,
  authController.registerWithEmail,
  responseAndSaveToken,
)
router.post(
  "/login/email",
  authValidator.loginValidation,
  authController.loginWithEmail,
  responseAndSaveToken,
)
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
router.post("/logOut", requireAuth, authController.logOut)

router.post(
  "/refreshToken",
  authController.refreshUserSession,
  responseAndSaveToken,
)

module.exports = router
