const mongoose = require("mongoose")
const { Schema } = mongoose

const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Message is require"],
    },
    roomId: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: [true, "UserId is require"],
    },
    react: {
      type: [
        {
          ownerId: { type: String, required: true },
          emoji: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Message", messageSchema)
