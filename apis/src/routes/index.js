const router = require("express").Router()
const user = require("@routes/user.route")
const room = require("@routes/room.route")
const message = require("@routes/message.route")
const auth = require("@routes/auth.route")
const post = require("@routes/post.route")
const community = require("@routes/community.route")
const comment = require("@routes/comment.route")

const fakerController = require("@controller/faker.controller.js")

const verifyToken = require("@middleware/requireAuth")

router.use("/users", verifyToken, user)
router.use("/room", verifyToken, room)
router.use("/message", message)
router.use("/auth", auth)
router.use("/post", post)
router.use("/community", verifyToken, community)
router.use("/comment", comment)
/// fake data
router.post("/faker/user", fakerController.createFakerUser)
router.post("/faker/community", fakerController.createFakerCommunity)
router.post("/faker/post", fakerController.createFakerPost)

module.exports = router
