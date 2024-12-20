const roomHandler = require("./room.handlers")
const roomEvent = socket => {
  const { createRoom } = roomHandler()

  socket.on("room:create", createRoom)
}

module.exports = roomEvent
