const router = require("express").Router()
const user = require("@routes/user.route")
const room = require("@routes/room.route")
const message = require("@routes/message.route")
const auth = require("@routes/auth.route")

const verifyToken = require("@middleware/requireAuth")

router.use("/users", verifyToken, user)
router.use("/room", verifyToken, room)
router.use("/message", verifyToken, message)
router.use("/auth", auth)

module.exports = router
