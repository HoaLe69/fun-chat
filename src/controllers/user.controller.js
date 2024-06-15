const User = require("@schema/user.schema.js")

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
      const tokeninfo = await verify_google_token(gg_token, res)
      const user_infor = {
        email: tokeninfo["email"],
        picture: tokeninfo["picture"],
        display_name: tokeninfo["name"],
      }
      const db_user = await User.findOne({ email: user_infor.email })
      if (!db_user) {
        await new User({ ...user_infor }).save()
      }
      return res.json({ ...tokeninfo })
    } catch (e) {
      next(e)
    }
  },
}

module.exports = userController
