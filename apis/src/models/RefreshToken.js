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

refreshTokenSchema.statics = {
  async findByUserIdAndToken(userId, token) {
    const refreshToken = this.findOne({ userId, token })
    return refreshToken
  },
  async deleteManyByUserId(userId) {
    await this.deleteMany({ userId })
  },
  async createNewRefreshToken(newRefreshToken) {
    const refreshToken = await newRefreshToken.save()
    return refreshToken
  },
}

module.exports = mongoose.model("RefreshToken", refreshTokenSchema)
