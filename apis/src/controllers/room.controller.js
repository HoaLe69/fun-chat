const Room = require("@models/Room")
const roomServices = require("@services/roomServices")

const roomController = {
  // create new room
  create: async (req, res) => {
    try {
      const room = await new Room({ ...req.body }).save()
      return res.status(201).json(room)
    } catch (err) {
      console.error(err)
    }
  },
  markAsRead: async (req, res, next) => {
    try {
      const { roomId, userId } = req.body
      const updatedRoom = await roomServices.markAsReadAsync(roomId, userId)
      return res.status(200).json(updatedRoom)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  // get list room by userId
  list: async (req, res) => {
    try {
      const rooms = await Room.find({
        members: req.params.userId,
      })
        .populate("latestMessage")
        .sort({ "latestMessage.createdAt": -1 })
      console.log(rooms)
      return res.status(200).json(rooms)
    } catch (err) {
      console.log(err)
    }
  },
  updateLatestMessage: async (req, res) => {
    try {
      const roomId = req.params.roomId

      const latestMessage = {
        ...req.body.latestMessage,
      }

      await Room.findOneAndUpdate(
        { _id: roomId },
        {
          $set: {
            latestMessage,
          },
        },
      )
      return res.status(204).send("ok")
    } catch (error) {
      console.error(error)
    }
  },
  checkRoomExist: async (req, res, next) => {
    try {
      const room = await roomServices.checkRoomAsync(req.query)
      if (!room) return res.status(404).send("room not found")
      return res.status(200).json(room)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
}

module.exports = roomController
