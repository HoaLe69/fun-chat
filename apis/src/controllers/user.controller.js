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
      const type = req.body.type
      if (type === "email") {
        const { email, password } = req.body
        const db_user = await User.findOne({ email })
        if (!db_user) return res.status(400).send("Email not registered")
        if (db_user.password !== password)
          return res.status(400).send("Password incorrect")
        const accessToken = JWT.generateAccessToken({
          id: db_user._id,
          email: db_user.email,
          picture: db_user.picture,
          display_name: db_user.display_name,
        })
        res.cookie("token", accessToken, { httpOnly: true })
        return res.status(200).send("OK")
      }
      const id_token = req.body.id_token
      console.log({ id_token })
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
  verifyUser: async (req, res) => {
    const userFromToken = req.user
    console.log(userFromToken.id)
    const user_db = await User.findOne({ email: userFromToken.email })
    return res.status(200).json(user_db)
  },
  getUser: async (req, res) => {
    try {
      const userId = req.params.userId
      if (!userId) return res.status(400).send("Invalid request")
      const user_db = await User.findById(userId)
      return res.status(200).json(user_db)
    } catch (err) {
      console.log(err)
    }
  },

  search: async (req, res) => {
    try {
      const email = req.query?.email
      const id = req.query?.userId
      console.log({ id })
      let users = await User.find({ email: { $regex: ".*" + email + ".*" } })
      if (users.length > 0) {
        return res.status(200).json(users.filter(user => user._id != id))
      }
      console.log({ users })
      return res.status(200).json(users)
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = userController
