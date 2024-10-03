const authUtils = require("@utils/auth")
const authServices = require("@services/authServices")
const { validationResult } = require("express-validator")
const { APIError } = require("@errors")

const authController = {
  async checkEmailIsExist(req, res, next) {
    try {
      const { email } = req.body
      await authServices.checkEmail(email)
      res.status(204).send("ok")
    } catch (error) {
      next(error)
    }
  },
  async sendAnOTP(req, res, next) {
    try {
      const { email } = req.body
      const token = await authServices.sendOTP(email)
      res.status(200).json({ token })
    } catch (error) {
      next(error)
    }
  },
  async registerWithEmail(req, res, next) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) throw new APIError(errors.array()[0].msg, 400)

      const savedUser = await authServices.register(req.body)
      req.user = savedUser
      next()
    } catch (error) {
      next(error)
    }
  },
  async loginWithEmail(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) throw new APIError(errors.array()[0].msg, 400)

      const storedUser = await authServices.login(req.body)

      req.user = storedUser
      next()
    } catch (error) {
      next(error)
    }
  },
  async loginWithDiscord(req, res, next) {
    try {
      const code = req.body.code
      console.log({ code })

      const user = await authServices.loginWithProvider({
        code,
        provider: "discord",
        getTokenFn: authUtils.getAccessTokenFromDiscord,
        getUserProfifeFn: authUtils.getUserProfileFromDiscord,
      })

      req.user = user
      next()
    } catch (error) {
      next(error)
    }
  },
  async loginWithGoogle(req, res, next) {
    try {
      const code = req.body.code

      const user = await authServices.loginWithProvider({
        code,
        provider: "google",
        getUserProfifeFn: authUtils.getUserProfileFromGoogle,
      })

      req.user = user
      next()
    } catch (error) {
      next(error)
    }
  },
  async loginWithFacebook(req, res, next) {
    try {
      const code = req.body.code
      const user = await authServices.loginWithProvider({
        code,
        provider: "facebook",
        getTokenFn: authUtils.getAccessTokenFromFacebook,
        getUserProfifeFn: authUtils.getUserProfileFromFacebook,
      })

      req.user = user
      next()
    } catch (error) {
      next(error)
    }
  },
  async logOut(req, res, next) {
    try {
      const user = req.user
      const refreshToken = req.cookies.refreshToken
      await authServices.logOut(refreshToken, user, res)
    } catch (error) {
      next(error)
    }
  },
  async refreshUserSession(req, res, next) {
    try {
      const oldRefreshToken = req.cookies.refreshToken
      const user = await authServices.refreshToken(oldRefreshToken)
      req.user = user
      next()
    } catch (error) {
      next(error)
    }
  },
}

module.exports = authController
