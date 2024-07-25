const jwt = require("jsonwebtoken")

const verify_user = (req, res, next) => {
  try {
    const token = req.cookies?.token
    if (!token) return res.status(401).send("You're not authenticated")
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).send("Invalid token")
      req.user = decoded
      next()
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = verify_user
