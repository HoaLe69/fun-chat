const jwt = require("jsonwebtoken")
require("dotenv").config()

const generateAccessToken = user => {
  return jwt.sign({ ...user }, process.env.SECRET_KEY, { expiresIn: "365d" })
}

module.exports = { generateAccessToken }
