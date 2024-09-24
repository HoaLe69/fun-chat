require("dotenv").config()

const cookieResponse = ({ res, key, value }) => {
  return res.cookie(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: process.env.MAX_AGE,
  })
}

module.exports = { cookieResponse }
