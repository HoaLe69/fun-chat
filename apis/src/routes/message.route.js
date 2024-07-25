const express = require("express")
const router = express.Router()

const messageController = require("@controller/message.controller")

router.post("/create", messageController.create)
router.get("/list/:channel_id", messageController.list)

module.exports = router
