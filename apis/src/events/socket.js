const messageEvent = require("./message.event")
const roomEvent = require("./room.event")

const onlines = {}
const handleSocket = io => {
  io.on("connection", socket => {
    console.log("A user connected")
    socket.on("disconnect", () => {
      console.log(onlines)
      console.log("user disconnected")
    })

    socket.on("online", id => {
      socket.join(id)
      onlines[id] = { status: "online" }
      io.emit("user-online", onlines)
    })
    socket.on("offline", id => {
      socket.leave(id)
      console.log("id", id)
      delete onlines[id]
      console.log("onlines", onlines)
      io.emit("user-offline", onlines)
    })

    socket.on("join", id => {
      console.log({ message: `user joined ${id}` })
      socket.join(id)
    })

    socket.on("leave", id => {
      socket.leave(id)
      console.log({ message: `user left room : ${id}` })
    })

    messageEvent(socket)
    roomEvent(socket)
  })
}

module.exports = handleSocket
