const User = require("@schema/user.schema.js")
const JWT = require("../utils/jwt")

const verify_google_token = async (token, res) => {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
  const response = await fetch(url, { method: "GET" })
  if (response.status === 400) {
    return res.status(400).send("Token invalid , let try again")
  }
  return response.json()
}

const userController = {
  login: async (req, res, next) => {
    try {
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
      }

      let db_user = await User.findOne({ email: user_infor.email })
      if (!db_user) {
        db_user = await new User({ ...user_infor }).save()
      }
      //generate access token
      const accessToken = JWT.generateAccessToken({
        id: db_user._id,
        email: db_user.email,
        picture: db_user.picture,
        display_name: db_user.display_name,
      })
      res.cookie("token", accessToken, {
        httpOnly: true,
      })
      return res.status(201).send("OK")
    } catch (e) {
      next(e)
    }
  },
  getUser: async (req, res, next) => {
    const user = req.user
    return res.json({ ...user })
  },
}

module.exports = userController
