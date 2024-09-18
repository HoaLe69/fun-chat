const jwt = require("jsonwebtoken")
require("dotenv").config()

const generateAccessToken = user => {
  return jwt.sign({ ...user }, process.env.SECRET_KEY, { expiresIn: "7d" })
}

const generateRefreshToken = user => {
  return jwt.sign({ ...user }, process.env.SECRET_KEY, { expiresIn: "14d" })
}

const verifyToken = token => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) throw new Error("Token invalid")
      return decoded
    })
  } catch (error) {
    console.error(error)
  }
}

module.exports = { generateAccessToken, generateRefreshToken, verifyToken }
