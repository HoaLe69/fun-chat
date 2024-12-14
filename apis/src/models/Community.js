const mongoose = require("mongoose")
const { Schema } = mongoose

const communitySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: null,
    },
    banner: {
      type: String,
      default: null,
    },
    members: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    moderators: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Community", communitySchema)
