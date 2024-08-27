const mongoose = require("mongoose")
const { Schema } = mongoose

const reactIconSchema = new Schema(
  {
    ownerId: { type: String, required: true },
    emoji: { type: String, required: true },
  },
  { _id: false },
)

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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    react: {
      type: [reactIconSchema],
      default: [],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Message", messageSchema)
