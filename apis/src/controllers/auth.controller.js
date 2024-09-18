const User = require("@schema/user.schema")
const tokenUtils = require("@utils/token")
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

      const accessToken = tokenUtils.generateAccessToken(payload)
      const refreshToken = tokenUtils.generateRefreshToken(payload)

      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: process.env.MAX_AGE,
      })

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: process.env.MAX_AGE,
      })
      return res.status(200).json({ user: payload })
    } catch (e) {
      next(e)
    }
  },
  async logOut(req, res) {
    try {
      res.clearCookie("accessToken")
      res.clearCookie("refreshToken")
      return res.status(200).json({ message: "Successfully logged out" })
    } catch (error) {
      console.error(error)
    }
  },
  refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken

      if (!refreshToken) return res.status(400).send("Invalid request")

      const user = tokenUtils.verifyToken(refreshToken)

      if (!user) return res.status(400).send("Invalid Token")

      if (user) {
        delete user.iat
        delete user.exp
        const accessToken = tokenUtils.generateAccessToken(user)
        const refreshToken = tokenUtils.generateRefreshToken(user)

        res.cookie("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: process.env.MAX_AGE,
        })

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: process.env.MAX_AGE,
        })
        return res.status(201).send("OK")
      }
      return res.status(200).json({ status: "ok" })
    } catch (error) {
      console.error(error)
    }
  },
}

module.exports = authController
