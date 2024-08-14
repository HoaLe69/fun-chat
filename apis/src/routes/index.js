const router = require("express").Router()
const user = require("@routes/user.route.js")
const room = require("@routes/room.route.js")
const message = require("@routes/message.route.js")

router.use("/users", user)
router.use("/room", room)
router.use("/message", message)

module.exports = router
