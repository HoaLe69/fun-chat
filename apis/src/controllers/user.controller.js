const User = require("@schema/user.schema")
const mongoose = require("mongoose")
const { convertNameToSearchTerm } = require("@utils/convert-search-term")

const userController = {
  verifyUser: async (req, res) => {
    const userFromToken = req.user
    const user_db = await User.findOne({ email: userFromToken.email })
    return res.status(200).json(user_db)
  },

  getUserById: async (req, res) => {
    try {
      console.log({ maxAge: process.env.MAX_AGE })
      const userId = req.params.userId
      if (!userId) return res.status(400).send("Invalid request")
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid user format" })
      }
      const user_db = await User.findById({ _id: userId })
      return res.status(200).json(user_db)
    } catch (err) {
      console.log(err)
    }
  },

  search: async (req, res) => {
    try {
      const display_name = req.query?.q
      const id = req.query?.userId
      console.log({ id })
      let users = await User.find({
        normalized_name: {
          $regex: new RegExp(convertNameToSearchTerm(display_name, "i")),
        },
      })
      if (users.length > 0) {
        return res.status(200).json(users.filter(user => user._id != id))
      }
      return res.status(200).json(users)
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = userController
