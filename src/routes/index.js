const router = require("express").Router()
const user = require("@routes/user.route.js")

router.use("/user", user)
router.use("/message", (req, res) => {
  res.json({ message: "hello message" })
})

module.exports = router
