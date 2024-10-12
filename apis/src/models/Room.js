const mongoose = require("mongoose")
const { Schema } = mongoose

const roomSchema = new Schema(
  {
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
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
