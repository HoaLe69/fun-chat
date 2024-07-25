const express = require("express")
const router = express.Router()
const channelController = require("@controller/channel.controller")

router.post("/create", channelController.create)
router.get("/list/:userId", channelController.list)

module.exports = router
