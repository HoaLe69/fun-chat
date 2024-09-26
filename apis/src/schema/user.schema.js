const mongoose = require("mongoose")
const { Schema } = mongoose

const userScheme = new Schema(
  {
    email: {
      type: String,
      require: false,
      default: null,
    },
    password: {
      type: String,
      minLength: [6, "Must be at least 6 characters"],
      default: null,
    },
    picture: {
      type: String,
    },
    display_name: {
      type: String,
      required: [true, "Display name is require"],
    },
    normalized_name: {
      type: String,
    },
    friends: {
      type: Array,
      default: [],
    },
  },
  { timestamps: { createAt: "created_at" } },
)

module.exports = mongoose.model("User", userScheme)
