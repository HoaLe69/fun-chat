const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const database = {
  host: process.env.HOST,
  name: process.env.DB_NAME,
  mongourl: process.env.MONGODB_URL,
}
const connect = async () => {
  try {
    await mongoose.connect(database.mongourl)
    console.log("connected database")
  } catch (e) {
    console.error("Failed to connect database")
  }
}
module.exports = { connect }
