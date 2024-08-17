const handleSocket = io => {
  io.on("connection", socket => {
    console.log("A user connected")
    socket.on("disconnect", () => {
      console.log("user disconnected")
    })

    socket.on("join", room => {
      socket.join(room)
    })

    socket.on("typing", data => {
      const { isTyping, userId, room_id } = data
      io.to(room_id).emit("user_typing", {
        isTyping,
        userId,
        room_id,
      })
    })

    socket.on("room:createRoomChat", info => {
      const { roomInfo, recipientId } = info
      io.to(recipientId).emit("room:getNewChatInfo", roomInfo)
    })

    socket.on("sendMessage", data => {
      const { room_id, content, userId } = data
      const timestamp = Date.now()
      io.to(room_id).emit("getMessage", {
        content,
        createAt: timestamp,
        userId,
        roomId: room_id,
      })
    })
  })
}

module.exports = handleSocket
