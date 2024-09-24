const mongoose = require("mongoose")
const { Schema } = mongoose

const refreshTokenSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
})

refreshTokenSchema.methods.isValid = function () {
  return this.expiresAt > new Date()
}

module.exports = mongoose.model("RefreshToken", refreshTokenSchema)
