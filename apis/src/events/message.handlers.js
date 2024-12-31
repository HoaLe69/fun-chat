const Message = require("@models/Message")
const Room = require("@models/Room")

function messageHandler() {
  return {
    deleteMessage: async function (payload, callback) {
      try {
        const socket = this
        const { msgId, roomId } = payload

        const storedMsg = await Message.findOne({ _id: msgId })
        if (!storedMsg) {
          return callback({
            error: "message not found",
          })
        }

        storedMsg.isDeleted = true
        await storedMsg.save()
        console.log({ storedMsg })

        callback({ ...storedMsg._doc })
        socket.to(roomId).emit("message:deleted", { ...storedMsg._doc })
      } catch (error) {
        console.log(error)
        return callback({ error: "something went wrong" })
      }
    },
    reactMessage: async function (payload, callback) {
      try {
        const socket = this
        const { msgId, body, roomId } = payload

        const storedMsg = await Message.findOne({ _id: msgId })

        if (!storedMsg) {
          return callback({
            error: "message not found",
          })
        }

        const reacted = storedMsg.react.find(r => r.ownerId === body.ownerId)
        if (!reacted) {
          storedMsg.react = [...storedMsg.react, body]
        } else {
          const storedReact = storedMsg.react.filter(r => r.ownerId !== body.ownerId)
          if (reacted.emoji === body.emoji) {
            storedMsg.react = storedReact
          } else {
            storedMsg.react = [...storedReact, body]
          }
        }
        const savedMessage = await storedMsg.save()

        callback({ ...savedMessage._doc })

        socket.to(roomId).emit("message:reacted", {
          ...savedMessage._doc,
        })
      } catch (error) {
        return callback({
          error: "something went wrong",
        })
      }
    },

    sendMessage: async function (payload, callback) {
      try {
        const socket = this

        console.log("payload", payload)
        const { msg, room, replyMessage, recipientId } = JSON.parse(payload.data)
        // console.log("msg", msg)
        // const newMessage = new Message({ ...msg })
        // if (replyMessage) {
        //   await Message.findOneAndUpdate(
        //     { _id: replyMessage._id },
        //     {
        //       $push: {
        //         replyBy: newMessage._id,
        //       },
        //     },
        //   )
        // }
        //
        // const savedMessage = await newMessage.save()
        //
        // const storedRoom = await Room.findOne({ _id: msg.roomId })
        // storedRoom.latestMessage = savedMessage._id
        // //update count of unread message for recipient
        // const unReadMessage = storedRoom.unreadMessage
        // if (unReadMessage.length === 0) {
        //   storedRoom.unreadMessage = [{ userId: recipientId, count: 1 }]
        // } else {
        //   const user = unReadMessage.find(u => u.userId === recipientId)
        //
        //   if (!user) {
        //     storedRoom.unreadMessage = [...unReadMessage, { userId: recipientId, count: 1 }]
        //   } else {
        //     storedRoom.unreadMessage = storedRoom.unreadMessage.map(u => {
        //       if (u.userId === recipientId) {
        //         return { ...u, count: u.count + 1 }
        //       }
        //       return u
        //     })
        //   }
        // }
        // await storedRoom.save()
        //
        callback({
          ...msg,
          replyTo: replyMessage,
        })
        socket.to(msg.roomId).emit("message:sent", {
          ...msg,
          replyTo: replyMessage,
        })

        socket.to(recipientId).emit("notification-room-message:unread", {
          ...room,
        })
      } catch (error) {
        console.log("error", error)
        callback({
          error: error,
        })
      }
    },
  }
}

module.exports = messageHandler
