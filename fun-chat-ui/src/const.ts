export const { VITE_GOOGLE_CLIENT_ID: GOOGLE_CLIEN_ID, VITE_API_URL } =
  import.meta.env

export const STATUS_CODES = Object.freeze({
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CREATED: 201,
  INTERNAL_SERVER_ERROR: 500,
})
