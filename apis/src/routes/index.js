const router = require("express").Router()
const user = require("@routes/user.route.js")
const channel = require("@routes/channel.route.js")
const message = require("@routes/message.route.js")

router.use("/users", user)
router.use("/channel", channel)
router.use("/message", message)

module.exports = router
