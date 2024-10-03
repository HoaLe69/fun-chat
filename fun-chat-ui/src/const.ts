export const {
  VITE_GOOGLE_CLIENT_ID: GOOGLE_CLIEN_ID,
  VITE_FACEBOOK_CLIENT_ID,
  VITE_META_REDIRECT_URI,
  VITE_DISCORD_CLIENT_ID,
  VITE_DISCORD_REDIRECT_URI = 'http%3A%2F%2Flocalhost%3A5173%2Flogin%2Fredirect%2Fdiscord&scope=identify+email',
  VITE_API_URL,
} = import.meta.env

export const STATUS_CODES = Object.freeze({
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CREATED: 201,
  INTERNAL_SERVER_ERROR: 500,
})

export const metaAuthorizeURL = () => {
  return `https://www.facebook.com/v20.0/dialog/oauth?client_id=${VITE_FACEBOOK_CLIENT_ID}&redirect_uri=${VITE_META_REDIRECT_URI}`
}

export const discordAuthorizeURL = () => {
  return `https://discord.com/oauth2/authorize?client_id=${VITE_DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${VITE_DISCORD_REDIRECT_URI}`
}

export const googleAuthorizeURL = (access_token: string) => {
  return `http://localhost:5173/login/redirect/google?code=${access_token}`
}
