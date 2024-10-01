const mongoose = require("mongoose")
const { Schema } = mongoose

const latestMessageSchema = new Schema(
  {
    text: String,
    createdAt: Date,
    ownerId: String,
  },
  { _id: false },
)

const roomSchema = new Schema(
  {
    latestMessage: {
      type: latestMessageSchema,
      default: null,
    },
    members: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      enum: ["spam", "offical"],
      required: false,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Room", roomSchema)
