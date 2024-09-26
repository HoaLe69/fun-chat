const User = require("@schema/user.schema")
const RefreshToken = require("@schema/refreshToken.schema")
const SocialAccount = require("@schema/socialAccount.schema")
const tokenUtils = require("@utils/token")
const authUtils = require("@utils/auth")
const { convertNameToSearchTerm } = require("@utils/convert-search-term")

const verify_google_token = async (token, res) => {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
  const response = await fetch(url, { method: "GET" })
  if (response.status === 400) {
    return res.status(400).send("Token invalid , let try again")
  }
  return response.json()
}

const authController = {
  async login(req, res, next) {
    try {
      const type = req.body.type
      let db_user
      if (type === "email") {
        //extract data from request
        const { email, password } = req.body
        db_user = await User.findOne({ email })
        // user not found
        if (!db_user) return res.status(400).send("Email not registered")
        // TODO: encrypt password
        if (db_user.password !== password)
          return res.status(400).send("Password incorrect")
      } else {
        const id_token = req.body.id_token
        if (!id_token)
          return res.status(400).send("Token is not attached in request")
        // extract data from token gg
        const tokeninfo = await verify_google_token(id_token, res)
        if (!tokeninfo) return res.status(400).send("Failed to verify email")

        const user_infor = {
          email: tokeninfo["email"],
          picture: tokeninfo["picture"],
          display_name: tokeninfo["name"],
          normalized_name: convertNameToSearchTerm(tokeninfo["name"]),
        }

        db_user = await User.findOne({ email: user_infor.email })
        if (!db_user) {
          db_user = await new User({ ...user_infor }).save()
        }
      }

      const payload = {
        id: db_user._id,
        email: db_user.email,
        picture: db_user.picture,
        display_name: db_user.display_name,
      }
      // generate new token
      const accessToken = tokenUtils.generateAccessToken(payload)
      const refreshToken = tokenUtils.generateRefreshToken(payload)

      // save the refresh Token in the database with an expiry
      await new RefreshToken({
        userId: payload.id,
        token: refreshToken,
        expiresAt: tokenUtils.calculateExpireDate(20160),
      }).save()

      // send tokens to user via cookie
      authUtils.cookieResponse({ res, key: "token", value: accessToken })
      authUtils.cookieResponse({
        res,
        key: "refreshToken",
        value: refreshToken,
      })

      return res.status(200).json({ user: payload })
    } catch (e) {
      next(e)
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
        userId: user?.id,
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
