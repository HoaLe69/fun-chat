const notifyHandlers = require("./notify.handlers")
const notifyEvent = socket => {
  const { pushNotify } = notifyHandlers()

  socket.on("notification:send", pushNotify)
}

module.exports = notifyEvent

