const Message = require("@schema/message.schema.js")
const Room = require("@schema/room.schema.js")

const messageController = {
  create: async (req, res) => {
    try {
      const newMsg = await new Message(req.body).save()
      // update latest message
      await Room.findOneAndUpdate(
        { _id: req.body.roomId },
        {
          $set: {
            latestMessage: {
              text: req.body.text,
              createdAt: newMsg.createdAt,
            },
          },
        },
        { new: true },
      )
      return res.status(200).json(newMsg)
    } catch (err) {
      console.log(err)
    }
  },
  dropReact: async (req, res) => {
    try {
      const reactMessage = req.body.react
      const messageId = req.params.messageId
      const msg = await Message.findOneAndUpdate(
        { _id: messageId },
        {
          $push: { react: reactMessage },
        },
        { new: true },
      )
      return res.status(200).json(msg)
    } catch (error) {
      console.error(error)
    }
  },
  recall: async (req, res) => {
    try {
      const messageId = req.params.messageId
      const msg = await Message.findOneAndUpdate(
        { _id: messageId },
        {
          $set: {
            isDeleted: true,
          },
        },
        { new: true },
      )
      return res.status(200).json(msg)
    } catch (error) {
      console.error(error)
    }
  },
  getList: async (req, res) => {
    try {
      const roomId = req.params.roomId
      if (!roomId) return res.status(400).send("Invalid params ")
      const messages = await Message.find({
        roomId,
      })
      return res.status(200).json(messages)
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = messageController
