const express = require("express")
require("module-alias/register")
const app = express()
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")

const db = require("@config/db.js")
const router = require("@routes")

// connect database
db.connect()

// apply middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
)
dotenv.config() // allow read environment variable in .env file
app.use(morgan("dev")) // automatically log comming requiest
app.use(bodyParser.urlencoded({ extended: false })) // parse application/-WWW-urlencoded
app.use(bodyParser.json()) // parse application/json

// use the PORT environment variable, or default to 8080
const PORT = process.env.PORT || 8080

app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).send("something broke!")
})

app.get("/", (req, res) => {
  res.json({ message: "welcome to funchat" })
})
//app routing
app.use("/api/v1", router)

app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`)
})
