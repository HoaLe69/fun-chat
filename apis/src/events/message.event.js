const messageHandler = require("./message.handlers")

const messageEvent = socket => {
  const { sendMessage, reactMessage, deleteMessage } = messageHandler()

  socket.on("message:send", sendMessage)
  socket.on("message:react", reactMessage)
  socket.on("message:delete", deleteMessage)
}

module.exports = messageEvent
