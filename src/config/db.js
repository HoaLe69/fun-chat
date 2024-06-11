const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const database = {
  host: process.env.HOST,
  name: process.env.DB_NAME,
}
const connect = async () => {
  try {
    await mongoose.connect(`${database.host}/${database.name}`)
    console.log("connected database")
  } catch (e) {
    console.error("Failed to connect database")
  }
}
module.exports = { connect }
