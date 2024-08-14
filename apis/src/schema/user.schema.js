const mongoose = require("mongoose")
const { Schema } = mongoose

const userScheme = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email require"],
      minLength: [10, "Must be at least 10 characters"],
      maxlength: [50, "Must be 50 characters or less"],
      unique: true,
    },
    password: {
      type: String,
      minLength: [6, "Must be at least 6 characters"],
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
