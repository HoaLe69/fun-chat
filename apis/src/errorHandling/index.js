class BaseError extends Error {
  constructor(name, httpCode, description, isOperational) {
    super(description)
    this.name = name
    this.httpCode = httpCode
    this.isOperational = isOperational
    Error.captureStackTrace(this)
  }
}

class APIError extends BaseError {
  constructor(
    name,
    httpCode = HttpStatusCode.BAD_REQUEST,
    isOperational = true,
    description,
  ) {
    super(name, httpCode, description, isOperational)
  }
}

const HttpStatusCode = Object.freeze({
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
})

module.exports = { APIError }
