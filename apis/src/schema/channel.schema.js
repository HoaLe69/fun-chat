const mongoose = require("mongoose")
const { Schema } = mongoose

const channelSchema = new Schema(
  {
    channel_name: {
      type: String,
      default: null,
    },
    picture: {
      type: String,
      default: null,
    },
    latest_message: {
      type: String,
      default: null,
    },
    members: {
      type: Array,
      default: [],
    },
    pos: {
      type: String,
      enum: ["spam", "offical"],
      required: false,
    },
    channel_type: {
      type: String,
      enum: ["group", "single"],
      default: "single",
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Channel", channelSchema)
