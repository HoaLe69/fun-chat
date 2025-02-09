const mongoose = require("mongoose")
const { Schema } = mongoose

const roomSchema = new Schema(
  {
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    members: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      enum: ["spam", "offical"],
      required: false,
    },
    unreadMessage: {
      type: [
        {
          userId: String,
          count: {
            type: Number,
            default: 0,
          },
        },
      ],
      default: [],
      _id: false,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Room", roomSchema)

roomSchema.statics = {
  async createNewRoom(newRoom) {
    const room = await newRoom.save()
    return room
  },
  async findRoomById(roomId) {
    const room = await this.findOne({ _id: roomId })
    return room
  },
}
