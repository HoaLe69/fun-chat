const notifyServices = require("@services/notifyServices")

const notifyController = {
  async createNotifications(req, res, next) {
    try {
      const storedNotifications = await notifyServices.createNotificationAsync(req.body)
      return res.status(201).json(storedNotifications)
    } catch (error) {
      next(error)
    }
  },
  async getNotificationsByUserId(req, res, next) {
    try {
      const userId = req.params.userId
      const notifications = await notifyServices.getNotificationByUserIdAsync(userId)
      return res.status(200).json(notifications)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  async markNotificationAsRead(req, res, next) {
    try {
      const notificationId = req.params.notificationId
      const notification = await notifyServices.markNotificationAsReadAsync(notificationId)
      return res.status(200).json(notification)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
}

module.exports = notifyController

