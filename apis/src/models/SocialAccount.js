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

socialAccountSchema.statics = {
  /**
   * find by social id
   * @param {string} socialId
   * @param {string} platform
   * @returns {Promise <user, APIError>}
   */
  async findByIdAndPlatform(socialId, platform) {
    const docs = await this.findOne({ socialId, platform }).populate("user")
    return docs.user
  },
}

module.exports = mongoose.model("SocialAccount", socialAccountSchema)
