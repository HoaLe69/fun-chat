const User = require("@models/User")
const RefreshToken = require("@models/RefreshToken")
const SocialAccount = require("@models/SocialAccount")
const { APIError } = require("@errors")
const authUtils = require("@utils/auth")
const tokenUtils = require("@utils/token")
const emailUtils = require("@utils/email")

const refreshToken = async oldRefreshToken => {
  if (!oldRefreshToken) throw new APIError("You're are not authenticated", 401)

  const user = tokenUtils.verifyRefreshToken(oldRefreshToken)

  const deletedRefreshToken =
    await RefreshToken.findOneAndDeleteByUserIdAndToken(
      user?._id,
      oldRefreshToken,
    )

  if (!deletedRefreshToken) {
    await RefreshToken.deleteManyByUserId(user?.id)
    throw new APIError("You don't have permission", 403)
  }

  if (!deletedRefreshToken.isValid()) {
    throw new APIError("You need to re-authenticated", 401)
  }

  return user
}
const checkEmail = async email => {
  if (!email) throw new APIError("Invalid request", 400)
  const user = await User.findUserByEmailAndNotNullPassword(email)

  if (user) throw new APIError("Email have been used", 422)
  return user
}

/**
 *@param {string} email
 * @returns {string}  short live token to verify email
 */
const sendOTP = async email => {
  if (!email) throw new APIError("Invalid request", 400)

  const otp = authUtils.generateOTP()

  //TODO: dynamic variable for expiry time
  const token = tokenUtils.generateShortLivedAccessToken({ email, otp }, 60)
  emailUtils.sendEmailToUser(email, otp)

  return token
}

const register = async authenticationInfo => {
  const { email, password, display_name, token, otp } = authenticationInfo
  const claims = tokenUtils.verifyAccessToken(token)

  if (claims.otp !== parseInt(otp)) throw new APIError(400, "Wrong OTP")

  const hashedPassword = await authUtils.hashingPassword(password)
  const picture = "https://picsum.photos/seed/picsum/200/300"

  const newUser = await new User({
    email,
    password: hashedPassword,
    display_name,
    picture,
  })

  const savedUser = await User.createUser(newUser)

  return savedUser
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User , APIError>}
 */
const login = async ({ email, password }) => {
  const storedUser = await User.findUserByEmailAndNotNullPassword(email)

  if (!storedUser.isVerified) throw new APIError("Email is not active", 400)

  const isMatchPassword = await authUtils.compareHashedPassword(
    password,
    storedUser.password,
  )

  if (!isMatchPassword) throw new APIError("Wrong password", 400)

  return storedUser
}

/**
 * @param {string} code the authorization code provided by social platform
 * @param {string} provider name of platform
 * @param {function} getTokenFn get accessToken from authorization code
 * @param {function} getUserProfifeFn get user profile information
 * @returns {Promise<User , APIError>}
 */
const loginWithProvider = async ({
  code,
  provider,
  getTokenFn,
  getUserProfifeFn,
}) => {
  if (!code) throw new APIError("Invalid request", 400)

  const accessToken = provider === "google" ? code : await getTokenFn(code)

  const userInfo = await getUserProfifeFn(accessToken)
  console.log({ userInfo })

  if (!userInfo?.id) throw new APIError("Login session was expired", 400)

  const storedUser = await SocialAccount.findByIdAndPlatform(
    userInfo.id,
    provider,
  )
  // user  used to login on DevChatter
  if (storedUser) return storedUser

  /*create new user*/
  const newUser = await new User({
    email: userInfo.email,
    display_name: userInfo.name,
    picture: userInfo.picture,
  })

  const savedUser = await newUser.save()

  /*create new SocialAccount*/
  await new SocialAccount({
    socialId: userInfo.id,
    platform: "google",
    user: savedUser._id,
  }).save()

  return savedUser
}

module.exports = {
  checkEmail,
  sendOTP,
  logOut,
  register,
  login,
  refreshToken,
  loginWithProvider,
}
