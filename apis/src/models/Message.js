const mongoose = require("mongoose")
const { Schema } = mongoose

const reactIconSchema = new Schema(
  {
    ownerId: { type: String, required: true },
    emoji: { type: String, required: true },
  },
  { _id: false },
)

const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Message is require"],
    },
    roomId: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: [true, "UserId is require"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    react: {
      type: [reactIconSchema],
      default: [],
    },
    replyBy: {
      type: [String],
      default: [],
    },
    replyTo: { type: mongoose.Schema.Types.ObjectId, default: null },
    status: {
      readBy: {
        type: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            readAt: { type: Date },
          },
        ],
        default: [],
        _id: false, //Disable auto-generation _id in subdocuments
      },
      type: {
        type: String,
        enum: ["sent", "delivered", "seen"],
        default: "sent",
      },
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Message", messageSchema)

messageSchema.statics = {
  async createMessage(newMessage) {
    const message = await newMessage.save()
    return message
  },
}
