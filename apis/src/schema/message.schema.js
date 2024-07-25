const mongoose = require("mongoose")
const { Schema } = mongoose

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Message is require"],
    },
    channel_id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: [true, "UserId is require"],
    },
    seen_by: {
      type: Array,
      default: [],
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
