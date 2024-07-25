const Channel = require("@schema/channel.schema.js")

const channelController = {
  // create new room
  create: async (req, res) => {
    try {
      const room = await new Channel({ ...req.body }).save()
      return res.status(201).json(room)
    } catch (err) {
      console.error(err)
    }
  },
  // get list room by userId
  list: async (req, res) => {
    try {
      const rooms = await Channel.find({
        members: { $in: [req.params.userId] },
      })
      return res.status(200).json(rooms)
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = channelController
