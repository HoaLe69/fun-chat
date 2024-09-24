const jwt = require("jsonwebtoken")
require("dotenv").config()

const accessTokenExpiresIn = "30m"
const refreshTokenExpirsIn = "14d"

const generateAccessToken = user => {
  return jwt.sign({ ...user }, process.env.SECRET_KEY, {
    expiresIn: accessTokenExpiresIn,
  })
}

const generateRefreshToken = user => {
  return jwt.sign({ ...user }, process.env.SECRET_KEY, {
    expiresIn: refreshTokenExpirsIn,
  })
}

const verifyToken = token => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) throw new Error("Token invalid")
      return decoded
    })
  } catch (error) {
    console.error(error)
    return null
  }
}

// Caculate the expiry date for the token
// durationInMinutes : the time (in minutes)the token should remain valid
const calculateExpireDate = durationInMinutes => {
  const now = new Date()
  return new Date(now.getTime() + durationInMinutes * 60 * 1000) // Convert minutes to miliseconds
}

// const currentTime = input => {
//   const inputTime = new Date(input)
//   const date = inputTime.getDate()
//   const month = inputTime.getMonth() + 1
//   const year = inputTime.getFullYear()
//   const hours = inputTime.getHours()
//   const minutes = inputTime.getMinutes()
//   const second = inputTime.getSeconds()
//   return `${date}:${month}:${year} - ${hours}:${minutes}:${second}`
// }

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  calculateExpireDate,
  verifyToken,
}
