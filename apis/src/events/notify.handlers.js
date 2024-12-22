function notifyHandlers() {
  return {
    pushNotify: async function (payload, callback) {
      try {
        const socket = this
        const notifications = payload

        if (!notifications) {
          return callback({
            error: "notification not found",
          })
        }
        notifications.forEach(async notification => {
          socket.to(notification.recipient).emit("notification:sent", {
            ...notification,
          })
        })
        callback({ message: "notification sent" })
      } catch (error) {
        callback({ error: "something went wrong" })
      }
    },
  }
}

module.exports = notifyHandlers

