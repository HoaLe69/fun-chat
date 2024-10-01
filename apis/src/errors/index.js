class APIError extends Error {
  /**
   * creates an  API error
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {boolean} [isOperational = true] - Indicates if the error is operational (trusted error)
   */

  constructor(message, statusCode, isOperational = true) {
    super(message) // Call the base Error class constructor
    this.statusCode = statusCode // HTTP status code (400 ,500)
    this.isOperational = isOperational // Operational error flag
    Error.captureStackTrace(this, this.constructor)
  }
}
module.exports = { APIError }
