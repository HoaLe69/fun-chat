const Message = require("@schema/message.schema.js")

const messageController = {
  create: async (req, res) => {
    try {
      const newMsg = await new Message(req.body).save()
      return res.status(200).json(newMsg)
    } catch (err) {
      console.log(err)
    }
  },
  list: async (req, res) => {
    try {
      const channel_id = req.params.channel_id
      if (!channel_id) return res.status(400).send("Invalid params ")
      const messages = await Message.find({
        channel_id,
      })
      return res.status(200).json(messages)
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = messageController
