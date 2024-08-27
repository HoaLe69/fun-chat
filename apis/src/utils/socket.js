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
      const { icon, roomId, ownerId, messageId } = data
      const message = {
        ownerId,
        messageId,
        emoji: icon,
      }
      io.to(roomId).emit("chat:getReactIcon", { ...message })
    })

    socket.on("chat:recallMessage", data => {
      const { roomId, messageId, recipientId, isNotifyRecipient, modifyTime } =
        data
      console.log({ data })
      io.to(roomId).emit("chat:getRecallMessage", {
        messageId,
        isDeleted: true,
      })
      if (isNotifyRecipient) {
        io.to(recipientId).emit("room:getIncomingMessages", {
          text: "Message was recall",
          createdAt: modifyTime,
          roomId,
        })
      }
    })
    socket.on("chat:sendMessage", data => {
      console.log({ data })
      const message = {
        ...data,
      }
      io.to(data.recipientId).emit("room:getIncomingMessages", {
        text: message.text,
        roomId: message.roomId,
        createdAt: message.createdAt,
      })
      io.to(data.roomId).emit("chat:getMessage", {
        ...message,
      })
    })
  })
}

module.exports = handleSocket
