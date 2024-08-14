const mongoose = require("mongoose")
const { Schema } = mongoose

const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Message is require"],
    },
    room_id: {
      type: String,
      required: true,
    },
    owner_id: {
      type: String,
      required: [true, "UserId is require"],
    },
    react: {
      type: [
        {
          owner_id: { type: String, required: true },
          emoji: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Message", messageSchema)
