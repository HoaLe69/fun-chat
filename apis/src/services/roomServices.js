const Room = require("@models/Room")
const { APIError } = require("@errors")

const checkRoomAsync = async member => {
  const { first, second } = member

  if (!first | second) throw new APIError("Invalid member")

  const room = await Room.findOne({
    members: { $all: [first, second] },
  })
  if (!room) {
    return null
  }
  return room
}

const markAsReadAsync = async (roomId, userId) => {
  if (!roomId || !userId) throw new APIError("Invalid data")
  const storedRoom = await Room.findOne({ _id: roomId })

  const unReadMessage = storedRoom.unreadMessage

  if (unReadMessage.length === 0) {
    return storedRoom
  }
  const user = unReadMessage.find(u => u.userId === userId)
  if (!user) return storedRoom

  storedRoom.unreadMessage = storedRoom.unreadMessage.map(u => {
    if (u.userId === userId) {
      return { ...u, count: 0 }
    }
    return u
  })

  await storedRoom.save()

  return storedRoom
}

module.exports = { checkRoomAsync, markAsReadAsync }
