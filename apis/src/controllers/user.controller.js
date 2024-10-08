const User = require("@models/User")
const mongoose = require("mongoose")
const { convertNameToSearchTerm } = require("@utils/convert-search-term")

const userController = {
  verifyUser: async (req, res) => {
    const userFromToken = req.user
    const user_db = await User.findOne({ _id: userFromToken._id })
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

  search: async (req, res, next) => {
    try {
      const email = req.query?.q
      const users = await User.findUsersByEmail(email)
      return res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },
}

module.exports = userController
