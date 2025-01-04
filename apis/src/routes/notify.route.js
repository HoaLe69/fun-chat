const express = require("express")
const router = express.Router()
const notifyController = require("@controller/notify.controller")

router.post("/push", notifyController.createNotifications)
router.get("/get/:userId", notifyController.getNotificationsByUserId)
router.patch("/mark-as-read/:notificationId", notifyController.markNotificationAsRead)

module.exports = router

