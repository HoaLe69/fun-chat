const mongoose = require("mongoose")
const { Schema } = mongoose

const notificationSchema = new Schema(
  {
    // reference to the user who receiving the notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    // type of notification
    type: {
      type: String,
      enum: ["new_post", "friend_request", "vote", "comment", "custom"],
      required: true,
    },
    // relavant metadata for the notification
    metadata: {
      resource_url: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
    // whether the notification has been read
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Notification", notificationSchema)

