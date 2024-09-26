require("dotenv").config()

const cookieResponse = ({ res, key, value }) => {
  return res.cookie(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: process.env.MAX_AGE,
  })
}

const getTokenFromFacebook = async code => {
  const redirect_uri = "http://localhost:5173/login/redirect/facebook"
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

const getUserProfileFromGoogle = async accessToken => {
  const res = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  const userInfo = await res.json()

  return userInfo
}

const getAccessTokenFromDiscord = async code => {
  const redirect_uri = "http://localhost:5173/login/redirect/discord"
  const keys = {
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
  }
  console.log({ keys })

  const data = new URLSearchParams({
    ...keys,
    grant_type: "authorization_code",
    code,
    redirect_uri,
  })

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  }

  const url = "https://discord.com/api/oauth2/token"

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: data,
  })
  const tokens = await response.json()
  return tokens
}

const getUserProfileFromDiscord = async accessToken => {
  const url = "https://discord.com/api/v10/users/@me"

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const userInfo = await response.json()

  return userInfo
}

const getFullPathAvatarDiscord = (userId, avatarHash) => {
  const isAnimated = avatarHash.startsWith("a_")
  const extension = isAnimated ? "gif" : "png"

  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}`
}

module.exports = {
  cookieResponse,
  getTokenFromFacebook,
  getUserProfileFromFacebook,
  getUserProfileFromGoogle,
  getAccessTokenFromDiscord,
  getFullPathAvatarDiscord,
  getUserProfileFromDiscord,
}
