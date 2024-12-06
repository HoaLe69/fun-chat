const mongoose = require("mongoose")
const { Schema } = mongoose

const commentSchema = new Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    upvoted: {
      type: [String],
      default: [],
    },
    downvoted: {
      type: [String],
      default: [],
    },
    root: {
      type: Boolean,
      default: false,
    },
    status: {
      accepted: {
        type: Boolean,
        default: false,
      },
      acceptedDate: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Comment", commentSchema)
