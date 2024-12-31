const mongoose = require("mongoose")
const { Schema } = mongoose

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    tag: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
    upvoted: {
      type: [String],
      default: [],
    },
    downvoted: {
      type: [String],
      default: [],
    },
    comments: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Post", postSchema)
