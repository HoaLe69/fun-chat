const jwt = require("jsonwebtoken")
require("dotenv").config()
const { APIError } = require("@errors")

const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRIESIN
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRIESIN

const generateAccessToken = user => {
  return jwt.sign({ ...user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: accessTokenExpiresIn,
  })
}

const generateShortLivedAccessToken = (user, expiresIn) => {
  return jwt.sign({ ...user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn,
  })
}

const generateRefreshToken = user => {
  return jwt.sign({ ...user }, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: refreshTokenExpiresIn,
  })
}

const verifyAccessToken = token => {
  return verifyToken(token, process.env.ACCESS_TOKEN_SECRET_KEY)
}
const verifyRefreshToken = token => {
  return verifyToken(token, process.env.REFRESH_TOKEN_SECRET_KEY)
}
const verifyToken = (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey, (err, decoded) => {
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
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  calculateExpireDate,
  generateRefreshToken,
  generateShortLivedAccessToken,
}
