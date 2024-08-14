const Message = require("@schema/message.schema.js")
const Room = require("@schema/room.schema.js")

const messageController = {
  create: async (req, res) => {
    try {
      const newMsg = await new Message(req.body).save()
      // update latest message
      await Room.findOneAndUpdate(
        { _id: req.body.channel_id },
        { $set: { latest_message: req.body.content } },
        { new: true },
      )
      return res.status(200).json(newMsg)
    } catch (err) {
      console.log(err)
    }
  },
  list: async (req, res) => {
    try {
      const room_id = req.params.room_id
      if (!room_id) return res.status(400).send("Invalid params ")
      const messages = await Message.find({
        room_id,
      })
      return res.status(200).json(messages)
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = messageController
