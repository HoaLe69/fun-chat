const mongoose = require("mongoose")
const { Schema } = mongoose

const latestMessageScheam = new Schema(
  {
    text: String,
    createdAt: Date,
  },
  { _id: false },
)

const roomSchema = new Schema(
  {
    latestMessage: {
      type: latestMessageScheam,
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
