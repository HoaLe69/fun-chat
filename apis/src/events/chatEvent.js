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
      //update last message of this room
      newRoom.latestMessage = newMessage?._id
      // save change
      await newRoom.save()
      await newMessage.save()

      const responseRoom = {
        ...newRoom._doc,
        latestMessage: { ...newMessage._doc },
      }
      // send to recipient
      io.to(roomInfo.recipient).emit("room:newChat", {
        room: responseRoom,
      })
      // send to userLoginnewRoom._doc
      socket.emit("room:newChat", {
        room: responseRoom,
        creator: roomInfo.sender,
      })
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("chat:statusMessage", async data => {
    /**
     * msg for case update single message
     * status is object  detail of status message {userId , readAt}
     * roomId is id current select room
     * recipient is id of receiver
     * msgs is an array includes all of id message which is not seen.
     * */
    const { msg, msgs, status, roomId, recipient } = data
    switch (status.type) {
      case "delivered":
        await Message.findOneAndUpdate(
          {
            _id: msg._id,
          },
          {
            status,
          },
        )
        io.to(msg.ownerId).emit("chat:updateStatusMessage", {
          _id: msg._id,
          status,
        })
        break
      case "seen":
        const updatedMsg = await Message.updateMany(
          {
            roomId,
            $or: [{ "status.type": "delivered" }, { "status.type": "sent" }],
          },
          {
            status,
          },
        )
        console.log({ updatedMsg })
        socket.emit("chat:updateStatusMessages", {
          msgs,
          status,
          roomId,
          recipient,
        })
        io.to(recipient).emit("chat:updateStatusMessages", {
          msgs,
          status,
          roomId,
        })
        break
    }
  })
  socket.on("chat:sendMessage", async data => {
    try {
      const { msg, recipientId, replyMessage } = data
      const newMessage = new Message({ ...msg })
      if (replyMessage) {
        await Message.findOneAndUpdate(
          { _id: replyMessage._id },
          {
            $push: {
              replyBy: newMessage._id,
            },
          },
        )
      }

      const savedMessage = await newMessage.save()

      await Room.findOneAndUpdate(
        {
          _id: msg.roomId,
        },
        {
          $set: {
            latestMessage: savedMessage._id,
          },
        },
      )
      //send to this room
      socket.emit("chat:receiveMessage", {
        ...savedMessage._doc,
        replyTo: replyMessage,
      })
      io.to(recipientId).emit("chat:receiveMessage", {
        ...savedMessage._doc,
        replyTo: replyMessage,
      })
    } catch (error) {
      console.log("error", error)
    }
  })

  socket.on("chat:typing", data => {
    const { isTyping, roomId, userId } = data
    io.to(roomId).emit("chat:userTypingStatus", { isTyping, userId })
  })

  socket.on("chat:messageActions", async msg => {
    try {
      /*
       * recipient id
       * type of actions : delete , reaction
       * _id message
       * roomId
       * update information
       *  --- reaction msg : { ownerId , emoji }
       *  --- remove msg : {isDeleted : true}
       * */
      const type = msg.type
      const msgId = msg.msgId
      const body = msg.body
      const recipient = msg.recipient
      // response adress
      const roomId = msg.roomId

      const storedMsg = await Message.findOne({ _id: msgId })

      switch (type) {
        case "reaction":
          const reacted = storedMsg.react.find(r => r.ownerId === body.ownerId)
          if (!reacted) {
            storedMsg.react = [...storedMsg.react, body]
          } else {
            const storedReact = storedMsg.react.filter(
              r => r.ownerId !== body.ownerId,
            )
            if (reacted.emoji === body.emoji) {
              storedMsg.react = storedReact
            } else {
              storedMsg.react = [...storedReact, body]
            }
          }
          await storedMsg.save()
          break
        case "deletion":
          storedMsg.isDeleted = body.isDeleted
          await storedMsg.save()
          break
        default:
        //ignore
      }
      if (recipient) {
        io.to(recipient).emit("chat:receiveMessageActions", {
          type,
          info: storedMsg,
        })
      }
      io.to(roomId).emit("chat:receiveMessageActions", {
        type,
        info: storedMsg,
      })
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = chatEvent
