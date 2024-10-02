const jwt = require("jsonwebtoken")
require("dotenv").config()
const { APIError } = require("@errors")

const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRIESIN
const refreshTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRIESIN

const generateAccessToken = user => {
  return jwt.sign({ ...user }, process.env.SECRET_KEY, {
    expiresIn: accessTokenExpiresIn,
  })
}

const generateShortLivedToken = (user, expiresIn) => {
  return jwt.sign({ ...user }, process.env.SECRET_KEY, {
    expiresIn,
  })
}

const generateRefreshToken = user => {
  return jwt.sign({ ...user }, process.env.SECRET_KEY, {
    expiresIn: refreshTokenExpiresIn,
  })
}

const verifyToken = token => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) throw new APIError("Token invalid", 400)
      return decoded
    })
  } catch (error) {
    throw new APIError("Token invalid", 400)
  }
}

// Caculate the expiry date for the token
// durationInMinutes : the time (in minutes)the token should remain valid
const calculateExpireDate = durationInMinutes => {
  const now = new Date()
  return new Date(now.getTime() + durationInMinutes * 60 * 1000) // Convert minutes to miliseconds
}

module.exports = {
  verifyToken,
  generateAccessToken,
  calculateExpireDate,
  generateRefreshToken,
  generateShortLivedToken,
}
