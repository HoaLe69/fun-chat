const tokenUtils = require("@utils/token")
const RefreshToken = require("@schema/refreshToken.schema")

const totalSecondsOfTwoWeek = 20160

const responseAndSaveToken = async (req, res) => {
  const payload = req.user

  console.log("---------Let begin send token to user", payload)

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
    expiresAt: tokenUtils.calculateExpireDate(totalSecondsOfTwoWeek),
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
  console.log("-----------> Tada, It work!!!!!!!!!!!!")

  return res.status(200).send("ok")
}

module.exports = responseAndSaveToken
