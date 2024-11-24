const mongoose = require("mongoose")
const { convertNameToSearchTerm } = require("@utils/convert-search-term")
const { Schema } = mongoose
const { APIError } = require("@errors/index")

const userSchema = new Schema(
  {
    email: {
      type: String,
      require: function () {
        // sometime Provider give user profile without email
        return this.platform !== "discord" || this.platform !== "facebook"
      },
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
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createAt: "created_at" } },
)

// Pre-save hook to normalize display name
userSchema.pre("save", function (next) {
  if (this.display_name) {
    this.normalized_name = convertNameToSearchTerm(this.display_name)
  }
  next()
})

userSchema.statics = {
  /**
   * create a Single new User
   * @param {object} newUser
   * @returns {Promise <user, APIError>}
   * */
  async createUser(newUser) {
    const user = await newUser.save()
    return user
  },
  /**
   * create a Single new User @param {string} email
   * @returns {Promise <user, APIError>}
   * */
  async findUserByEmailAndNotNullPassword(email) {
    const user = this.findOne({ email, password: { $ne: null } })
    return user
  },
  async findUsersByEmail(email) {
    const users = this.find({ email })
    return users
  },
}

module.exports = mongoose.model("User", userSchema)
