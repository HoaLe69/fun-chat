const Message = require("@models/Message")
const Room = require("@models/Room")

const messageController = {
  getMessageById: async (req, res, next) => {
    try {
      const msgId = req.query.id
      const storedMessage = await Message.findOne({ _id: msgId })
      return res.status(200).json(storedMessage)
    } catch (error) {
      next(error)
    }
  },
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
              ownerId: req.body.ownerId,
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
      // const groupMessage = await Message.aggregate([
      //   {
      //     $match: { roomId },
      //   },
      //   {
      //     $group: {
      //       _id: {
      //         $dateToString: { format: "%d/%m/%Y", date: "$createdAt" },
      //       },
      //       messages: { $push: "$$ROOT" },
      //     },
      //   },
      //   { $sort: { _id: -1 } }, // sort by date descending
      // ])
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = messageController
