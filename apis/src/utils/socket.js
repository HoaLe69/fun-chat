const handleSocket = io => {
  io.on("connection", socket => {
    console.log("A user connected")
    socket.on("disconnect", () => {
      console.log("user disconnected")
    })

    socket.on("join", room => {
      socket.join(room)
      console.log("user has join this room")
    })

    socket.on("sendMessage", data => {
      const { room, content, userId } = data
      const timestamp = Date.now()
      io.to(room).emit("getMessage", {
        content,
        createAt: timestamp,
        userId,
      })
    })
  })
}

module.exports = handleSocket
