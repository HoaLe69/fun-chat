const Room = require("@models/Room")

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
  checkRoomExist: async (req, res) => {
    try {
      const { first, second } = req.query
      console.log({ first, second })
      const room = await Room.findOne({
        members: { $all: [first, second] },
      })
      if (!room) {
        const tempRoom = new Room({ members: [first, second] })
        return res.status(200).json({ ...tempRoom._doc, new: true })
      }
      return res.status(200).json(room)
    } catch (error) {
      console.log(error)
    }
  },
}

module.exports = roomController
