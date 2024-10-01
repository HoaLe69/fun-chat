require("dotenv").config()

const errorHandling = (err, req, res, next) => {
  const errorStatus = err.statusCode || 500

  const errorMessage = err.message || "Internal server error"

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack, //TODO: show error stack only development enviroment
  })
}

module.exports = errorHandling
