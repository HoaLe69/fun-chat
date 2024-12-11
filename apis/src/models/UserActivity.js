const mongoose = require("mongoose")
const { Schema } = mongoose

const userActivitySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requried: true,
  },
  recent_communities_visited: {
    type: [String],
    default: [],
  },
  recent_post_visited: {
    type: [String],
    default: [],
  },
})

module.exports = mongoose.model("UserActivity", userActivitySchema)
