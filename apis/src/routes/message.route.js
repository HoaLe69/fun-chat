const express = require("express")
const router = express.Router()

const messageController = require("@controller/message.controller")

router.post("/create", messageController.create)
router.get("/list/:roomId", messageController.getList)
router.get("/", messageController.getMessageById)
router.patch("/recall/:messageId", messageController.recall)
router.patch("/react/:messageId", messageController.dropReact)
module.exports = router
