const mongoose = require("mongoose")
const { Schema } = mongoose

const roomSchema = new Schema(
  {
    latest_message: {
      type: String,
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
