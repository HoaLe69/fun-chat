const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token
    if (!token) return res.status(401).send("You're not authenticated")
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403).send("Invalid token")
      req.user = decoded
      next()
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = verifyToken
