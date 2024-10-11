const Room = require("@models/Room")
const Message = require("@models/Message")

const chatEvent = (socket, io) => {
  socket.on("room:createRoomChat", async data => {
    try {
      const { roomInfo, message } = data

      const members = [roomInfo?.sender, roomInfo?.recipient]
      const newRoom = new Room({ ...roomInfo, members })
      newRoom.latestMessage = message
      const savedRoom = await newRoom.save()

      const newMessage = await Message({ ...message })
      newMessage.roomId = savedRoom._id
      newMessage.createdAt = savedRoom.latestMessage.createdAt

      await newMessage.save()

      // send to recipient
      io.to(roomInfo.recipient).emit("room:newChat", { room: savedRoom })
      // send to userLogin
      io.to(roomInfo._id).emit("room:newChat", {
        room: savedRoom,
        success: true,
      })
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = chatEvent
