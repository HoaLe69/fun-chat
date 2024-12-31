const { APIError } = require("@errors")
const Notification = require("@models/Notification")

const createNotificationAsync = async data => {
  try {
    const { type } = data
    if (type === "new_post") {
      const { friends, sender, resource_url, message, picture_url } = data
      const notifications = friends.map(friend => ({
        recipient: friend,
        sender,
        type,
        metadata: {
          resource_url,
          message,
          picture_url,
        },
      }))
      const storedNotifications = await Notification.insertMany(notifications)
      return storedNotifications
    } else if (type === "comment") {
      const { notifications } = data
      const storedNotifications = await Notification.insertMany(notifications)
      return storedNotifications
    } else if (type === "friend_request") {
      const storedNotification = await new Notification({
        ...data,
      }).save()
      return storedNotification
    }
  } catch (error) {
    throw new APIError("Error creating notifications", 500)
  }
}

const getNotificationByUserIdAsync = async (userId, page = 1, limit = 10) => {
  if (!userId) throw new APIError("userId is required", 400)

  const pageNumber = Math.max(1, parseInt(page)) // Ensure page is at least 1
  const pageSize = Math.max(1, parseInt(limit)) // Ensure limit is at least 1

  // fetch paginate posts
  const notifications = await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize) // skip previous pages
    .limit(pageSize) // limit the result

  //Count total post in community
  const totalDocuments = await Notification.countDocuments({ recipient: userId })
  return {
    data: notifications,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / pageSize),
      pageSize,
      totalDocuments,
    },
  }
}

const markNotificationAsReadAsync = async notificationId => {
  if (!notificationId) throw new APIError("Notification id is required", 400)
  const updatedNotification = await Notification.findOneAndUpdate(
    { _id: notificationId },
    {
      $set: { isRead: true },
    },
    { new: true },
  )
  return updatedNotification
}

module.exports = { createNotificationAsync, getNotificationByUserIdAsync, markNotificationAsReadAsync }
