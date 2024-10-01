const User = require("@schema/user.schema")
const RefreshToken = require("@schema/refreshToken.schema")
const SocialAccount = require("@schema/socialAccount.schema")
const tokenUtils = require("@utils/token")
const authUtils = require("@utils/auth")
const emailUtils = require("@utils/email")
const { convertNameToSearchTerm } = require("@utils/convert-search-term")

const authController = {
  async checkEmailIsExist(req, res) {
    try {
      const { email } = req.body
      if (!email) return res.status(400).send("Invalid request")

      const isUsedEmail = await User.findOne({
        email,
        password: { $ne: null },
      })

      if (isUsedEmail)
        return res.status(400).json({ message: "Email have been used" })

      return res.status(200).send("Ok")
    } catch (error) {
      console.log(error)
    }
  },
  async sendAnOTP(req, res) {
    try {
      const { email } = req.body
      console.log({ email })
      if (!email) return res.status(400).send("Email is required")
      const otp = authUtils.generateOTP()

      const token = tokenUtils.generateShortLivedToken({ email, otp }, 60)

      emailUtils.sendEmailToUser(email, otp)
      return res.status(200).json({ token })
    } catch (error) {
      console.log()
    }
  },
  async registerWithEmail(req, res, next) {
    try {
      const { email, password, display_name, token, otp } = req.body

      const tokenInfo = tokenUtils.verifyToken(token)

      if (tokenInfo == null)
        return res.status(400).json({ message: "OTP was wrong or expiried" })

      //TODO: case otp start with 0
      if (tokenInfo.otp !== parseInt(otp))
        return res.status(400).json({ message: "Wrong OTP" })

      const hashedPassword = await authUtils.hashingPassword(password)

      const savedUser = await new User({
        email,
        password: hashedPassword,
        display_name,
        picture: "https://picsum.photos/seed/picsum/200/300",
        isVerified: true,
      }).save()

      req.user = savedUser
      next()
    } catch (error) {
      console.log(error)
    }
  },
  async loginWithEmail(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) return res.status(400).send("Invalid request")

      const storedUser = await User.findOne({
        email,
        password: { $ne: null },
      })

      if (!storedUser)
        return res.status(404).json({ message: "User not found" })

      // checking password is vaild or not using bcrypt
      const isValidPassword = await authUtils.compareHashedPassword(
        password,
        storedUser.password,
      )

      if (!storedUser.isVerified)
        return res
          .status(400)
          .json({ message: "Email is not active.", isVerified: false })

      if (isValidPassword) {
        req.user = storedUser
        // send token to user
        next()
      } else {
        return res.status(400).json({ message: "Wrong password." })
      }
    } catch (error) {
      console.log(error)
    }
  },
  async loginWithDiscord(req, res, next) {
    try {
      console.log(
        "-----------------------LOGIN WITH DISCORD--------------------------------",
      )
      await new Promise(resolve => setTimeout(resolve, 3000))
      const code = req.body.code
      const tokens = await authUtils.getAccessTokenFromDiscord(code)
      console.log(tokens)

      const userInfo = await authUtils.getUserProfileFromDiscord(
        tokens.access_token,
      )

      if (!userInfo || !code) return res.status(400).send("Invalid request")

      let payload

      // check user already have an account
      const storedUser = await SocialAccount.findOne({
        socialId: userInfo.id,
        platform: "discord",
      }).populate("user")

      if (storedUser) {
        console.log("---------Stored User-----------\n", storedUser.user)
        console.log("----------------> User have already an account")
        payload = storedUser.user
      } else {
        console.log("------------------Create new User")
        const savedUser = await new User({
          email: userInfo.email,
          display_name: userInfo.global_name,
          picture: authUtils.getFullPathAvatarDiscord(
            userInfo.id,
            userInfo.avatar,
          ),
          normalized_name: convertNameToSearchTerm(userInfo.global_name),
        }).save()

        console.log("Create new social account of user")
        await new SocialAccount({
          socialId: userInfo.id,
          platform: "discord",
          user: savedUser._id,
        }).save()

        payload = savedUser
      }

      console.log("---------------------> userInfo", payload)

      req.user = payload

      next()
    } catch (error) {
      console.log(error)
    }
  },
  async loginWithGoogle(req, res, next) {
    try {
      console.log(
        "-----------------------LOGIN WITH GOOGLE--------------------------------",
      )
      const code = req.body.code
      if (!code) return res.status(400).send("Invalid request")

      const userInfo = await authUtils.getUserProfileFromGoogle(code)

      if (!userInfo) return res.status(400).send("Invalid request")
      let payload

      //      check user already have an account
      const storedUser = await SocialAccount.findOne({
        socialId: userInfo.id,
        platform: "google",
      }).populate("user")

      if (storedUser) {
        console.log("---------Stored User-----------\n", storedUser.user)
        console.log("----------------> User have already an account")
        payload = storedUser.user
      } else {
        console.log("----------------Create new user-----------------")
        const savedUser = await new User({
          email: userInfo.email,
          display_name: userInfo.name,
          picture: userInfo.picture,
          normalized_name: convertNameToSearchTerm(userInfo.name),
        }).save()
        console.log("create new social account of user")
        await new SocialAccount({
          socialId: userInfo.id,
          platform: "google",
          user: savedUser._id,
        }).save()

        payload = savedUser
      }

      console.log("------------------> userInfo", payload)
      req.user = payload
      next()

      console.log(userInfo)
    } catch (error) {
      console.log(error)
    }
  },
  async loginWithFacebook(req, res, next) {
    try {
      console.log(
        "-----------------------LOGIN WITH META--------------------------------",
      )
      const code = req.body.code
      const token = await authUtils.getTokenFromFacebook(code)

      const userInfo = await authUtils.getUserProfileFromFacebook(
        token.access_token,
      )

      if (!userInfo) return res.status(400).send("Invalid request")

      // check user already have an account
      const storedUser = await SocialAccount.findOne({
        socialId: userInfo.id,
        platform: "facebook",
      }).populate("user")

      if (storedUser) {
        console.log("---------Stored User-----------\n", storedUser.user)
        console.log("--------------> User have already an account")
        payload = storedUser.user
      } else {
        console.log("--------------> Create new user account")
        // create a new user
        const savedUser = await new User({
          email: userInfo.email,
          picture: userInfo.picture.data.url,
          display_name: userInfo.name,
          normalized_name: convertNameToSearchTerm(userInfo.name),
        }).save()

        // save new social account
        await new SocialAccount({
          user: savedUser._id,
          socialId: userInfo.id,
          platform: "facebook",
        }).save()

        payload = savedUser
      }

      console.log("------------> userInfo", payload)
      req.user = payload
      next()
    } catch (error) {
      console.log(error)
    }
  },
  async logOut(req, res) {
    try {
      res.clearCookie("token")
      res.clearCookie("refreshToken")
      return res.status(200).json({ message: "Successfully logged out" })
    } catch (error) {
      console.error(error)
    }
  },
  async refreshToken(req, res) {
    try {
      const oldRefreshToken = req.cookies.refreshToken

      if (!oldRefreshToken) return res.status(403).send("Invalid request")

      const user = tokenUtils.verifyToken(oldRefreshToken)

      // refresh token has expired or secret key not correct
      if (user === null) return res.status(301).send("Login session is expire")

      // Fetch the stored refresh token from DB
      const storedRefreshToken = await RefreshToken.findOne({
        token: oldRefreshToken,
        userId: user?._id,
      })

      if (!storedRefreshToken)
        return res.status(403).send("Invalid or expired refresh token")

      // check if the token is still  valid or already used
      if (!storedRefreshToken.isValid() || storedRefreshToken.used) {
        // token is invalid or reused, delete all refresh tokens for the user and force logout
        await RefreshToken.deleteMany({ userId: user.id })
        return res
          .status(403)
          .send("Invalid or reused refresh token. Please re-authenticate")
      }

      // Mark the old refresh token as used
      storedRefreshToken.used = true
      await storedRefreshToken.save()

      delete user.iat
      delete user.exp

      // Proceed to issue new tokens
      const accessToken = tokenUtils.generateAccessToken(user)
      const refreshToken = tokenUtils.generateRefreshToken(user)

      // save new refresh token in the database
      await new RefreshToken({
        token: refreshToken,
        userId: user.id,
        expiresAt: tokenUtils.calculateExpireDate(20160),
      }).save()

      //send these token to user via cookie
      authUtils.cookieResponse({ res, key: "token", value: accessToken })
      authUtils.cookieResponse({
        res,
        key: "refreshToken",
        value: refreshToken,
      })

      return res.status(201).send("OK")
    } catch (error) {
      console.error(error)
    }
  },
}

module.exports = authController
