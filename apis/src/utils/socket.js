const handleSocket = io => {
  io.on("connection", socket => {
    console.log("A user connected")
    socket.on("disconnect", () => {
      console.log("user disconnected")
    })

    socket.on("join", id => {
      console.log({ message: `user joined ${id}` })
      socket.join(id)
    })

    socket.on("leave", id => {
      socket.leave(id)
      console.log({ message: `user left room : ${id}` })
    })

    socket.on("chat:typingStart", data => {
      const { userId, roomId } = data
      // broadCast to everyone in the room except the sender
      io.to(roomId).emit("chat:typingStart", {
        userId,
        roomId,
      })
    })

    socket.on("chat:typingStop", data => {
      //broadCast to everyone in the room except the sender
      const { userId, roomId } = data
      io.to(roomId).emit("chat:typingStop", {
        userId,
        roomId,
      })
    })

    socket.on("room:createRoomChat", info => {
      const { roomInfo, recipientId } = info
      io.to(recipientId).emit("room:getNewChatInfo", roomInfo)
    })

    socket.on("chat:sendReactIcon", data => {
      const { messageId, roomId, icon, ownerId } = data
      const message = {
        messageId,
        ownerId,
        emoji: icon,
      }
      io.to(roomId).emit("chat:getReactIcon", { ...message })
    })

    socket.on("chat:recallMessage", data => {})
    socket.on("chat:sendMessage", data => {
      const message = {
        ...data,
      }
      io.to(data.recipientId).emit("room:getIncomingMessages", { ...message })
      io.to(data.roomId).emit("chat:getMessage", { ...message })
    })
  })
}

module.exports = handleSocket
