const Message = require("@models/Message")
const path = require("path")
const Room = require("@models/Room")
const messageServices = require("@services/messageServices")
const { APIError } = require("@errors")

const messageController = {
  getLinkPreview: async (req, res, next) => {
    try {
      const { links, msgId } = req.body
      if (!links) throw new APIError("Links is require", 400)

      const linkProcesses = links.map(link => {
        return messageServices.fetchLinkPreview(link)
      })

      const linkPreviewInfos = await Promise.all(linkProcesses)

      //update message in db
      const updatedMessage = await Message.findOneAndUpdate(
        { _id: msgId },
        {
          $set: {
            "content.links": linkPreviewInfos,
          },
        },
      )
      console.log({ updatedMessage })

      return res.status(200).json(linkPreviewInfos)
    } catch (error) {
      next(error)
    }
  },
  download: async (req, res, next) => {
    try {
      const { filename, originalname } = req.params
      if (!filename) throw new APIError("File name is require")
      const filePath = path.join("src/uploads", filename)
      //set header to download with original name
      res.setHeader("Content-Type", "application/octet-stream; charset=utf-8")
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`)
      // Send the file with UTF-8 encoding
      res.download(filePath, originalname, error => {
        if (error) {
          console.error("Error download file", error)
          res.status(500).send("Error downloading file")
        }
      })
    } catch (error) {
      next(error)
    }
  },
  uploadMessageAttachment: async (req, res, next) => {
    try {
      const files = req.files
      console.log({ files })
      const fileDetails = messageServices.getFileDetail(req, files)
      return res.status(200).json(fileDetails)
    } catch (error) {
      next(error)
    }
  },
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
      //     const page = req.query.page || 1
      if (!roomId) return res.status(400).send("Invalid params ")
      const messages = await Message.find({
        roomId,
      }).populate("replyTo")
      //      const paginatedMessages = await messageServices.getPaginatedMessages(page)

      return res.status(200).json(messages)
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = messageController
