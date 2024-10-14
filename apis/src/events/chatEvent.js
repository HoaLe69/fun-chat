const Room = require("@models/Room")
const Message = require("@models/Message")

const chatEvent = (socket, io) => {
  socket.on("room:createRoomChat", async data => {
    try {
      const { roomInfo, message } = data

      const newRoom = new Room({
        ...roomInfo,
        members: [roomInfo?.sender, roomInfo?.recipient],
      })
      const newMessage = await Message({ ...message, roomId: roomInfo._id })

      const { roomId, ...latestMessage } = newMessage

      newMessage.roomId = roomId

      //update last message of this room
      newRoom.latestMessage = newMessage?._id

      // save change
      const savedRoom = await newRoom.save()
      await newMessage.save()

      const _savedRoom = {
        ...savedRoom._doc,
        latestMessage: latestMessage._doc,
      }

      // send to recipient
      io.to(roomInfo.recipient).emit("room:newChat", { room: _savedRoom })
      // send to userLogin
      io.to(roomInfo._id).emit("room:newChat", {
        room: _savedRoom,
        success: true,
      })
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("chat:sendMessage", async data => {
    try {
      const { msg, recipientId } = data
      const newMessage = new Message({ ...msg })

      const savedMessage = await newMessage.save()

      await Room.findOneAndUpdate(
        {
          _id: savedMessage.roomId,
        },
        {
          $set: {
            latestMessage: savedMessage._id,
          },
        },
        { new: true },
      )
      //send to this room
      io.to(msg.roomId).emit("chat:receiveMessage", savedMessage)

      /**sync newest message for conversation *
       * sync with current user
       * sync with recipient
       * */
      socket.emit("room:syncNewMessage", { latestMessage: savedMessage })
      io.to(recipientId).emit("room:syncNewMessage", {
        latestMessage: savedMessage,
      })
    } catch (error) {
      console.log("error", error)
    }
  })

  socket.on("chat:typing", data => {
    const { isTyping, roomId, userId } = data
    io.to(roomId).emit("chat:userTypingStatus", { isTyping, userId })
  })
}

module.exports = chatEvent
