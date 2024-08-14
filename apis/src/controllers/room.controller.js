const Room = require("@schema/room.schema.js")

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
      return res.status(200).json(rooms)
    } catch (err) {
      console.log(err)
    }
  },
  checkRoomExist: async (req, res) => {
    try {
      const room = await Room.findOne({
        members: { $all: req.query.members },
      })
      if (!room) return res.status(204).send("Not found")
      return res.status(200).json(room)
    } catch (error) {
      console.log(error)
    }
  },
}

module.exports = roomController
