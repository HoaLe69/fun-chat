const express = require("express")
const router = express.Router()
const roomController = require("@controller/room.controller")

router.post("/create", roomController.create)
router.get("/list/:userId", roomController.list)
router.get("/check-room", roomController.checkRoomExist)

module.exports = router
