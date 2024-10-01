const mongoose = require("mongoose")
const { Schema } = mongoose

const socialAccountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  socialId: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    enum: ["facebook", "google", "discord"],
    required: true,
  },
})

module.exports = mongoose.model("SocialAccount", socialAccountSchema)
