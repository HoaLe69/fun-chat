const Room = require("@models/Room")
const Message = require("@models/Message")

function roomHandler() {
  return {
    createRoom: async function (payload, callback) {
      try {
        const socket = this
        const { msg, room, recipient } = payload

        const _room = new Room({ ...room })
        const savedMsg = await new Message({ ...msg, roomId: _room?._id }).save()

        _room.latestMessage = savedMsg?._id

        await _room.save()

        callback({ room: _room })

        socket.to(recipient).emit("room:created", { room: _room })
      } catch (error) {
        callback({ error: "something went wrong" })
        console.log(error)
      }
    },
  }
}

module.exports = roomHandler
