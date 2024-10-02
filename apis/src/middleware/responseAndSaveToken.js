const tokenUtils = require("@utils/token")
const RefreshToken = require("@models/RefreshToken")
require("dotenv").config()

const responseAndSaveToken = async (req, res) => {
  const payload = req.user
  // Proceed to issue new tokens
  const accessToken = tokenUtils.generateAccessToken({
    _id: payload._id,
    email: payload.email,
  })
  const refreshToken = tokenUtils.generateRefreshToken({
    _id: payload._id,
    email: payload.email,
  })

  // save a new refresh token in the database
  await new RefreshToken({
    token: refreshToken,
    userId: payload._id,
    expiresAt: tokenUtils.calculateExpireDate(
      process.env.REFRESH_TOKEN_EXPIRIESIN_MINUTES,
    ),
  }).save()

  // send these token to user via cookie
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

  return res.status(200).send("ok")
}

module.exports = responseAndSaveToken
