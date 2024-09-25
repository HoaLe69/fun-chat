require("dotenv").config()

const cookieResponse = ({ res, key, value }) => {
  return res.cookie(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: process.env.MAX_AGE,
  })
}

const getTokenFromFacebook = async code => {
  const redirect_uri = "http://localhost:5173/login"
  const keys = {
    client_id: process.env.FB_CLIENT_ID,
    client_secret: process.env.FB_CLIENT_SECRET,
  }

  const url = `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${keys.client_id}&client_secret=${keys.client_secret}&code=${code}&redirect_uri=${redirect_uri}`

  const response = await fetch(url)

  const tokens = await response.json()
  return tokens
}

const getUserProfileFromFacebook = async accessToken => {
  const url = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`

  const response = await fetch(url)

  const userInfo = await response.json()
  return userInfo
}

module.exports = {
  cookieResponse,
  getTokenFromFacebook,
  getUserProfileFromFacebook,
}
