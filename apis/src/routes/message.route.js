const express = require("express")
const router = express.Router()
const upload = require("@config/multer")

const messageController = require("@controller/message.controller")

router.post("/create", messageController.create)
router.post("/uploads", upload.array("files", 10), messageController.uploadMessageAttachment)
router.get("/download/:filename/:originalname", messageController.download)
router.get("/list/:roomId", messageController.getList)
router.get("/", messageController.getMessageById)
router.patch("/recall/:messageId", messageController.recall)
router.patch("/react/:messageId", messageController.dropReact)
router.post("/link/preview", messageController.getLinkPreview)
module.exports = router
