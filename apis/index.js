require("module-alias/register")
const express = require("express")
const app = express()
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")
const cookies = require("cookie-parser")
const http = require("http")
const socketIo = require("socket.io")
const path = require("path")
const handleSocketEvent = require("@events/socket")
const db = require("@config/db.js")
const { createRandomUser } = require("@utils/faker.js")
const errorHandling = require("@middleware/errorHandling")

// connect database
db.connect()

const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
const router = require("@routes")
//basic socket io
handleSocketEvent(io)
app.use(cookies())

// apply middleware
app.use(
  cors({
    //    origin: "http://localhost:5173",
    origin: "http://localhost:5173",
    credentials: true,
  }),
)
dotenv.config() // allow read environment variable in .env file
app.use(morgan("dev")) // automatically log comming requiest
app.use(bodyParser.urlencoded({ extended: false })) // parse application/-WWW-urlencoded
app.use(bodyParser.json()) // parse application/json

// use the PORT environment variable, or default to 8080
const PORT = process.env.PORT || 8080

app.post("/seed-data-user", async (req, res) => {
  for (let i = 0; i < 20; i++) {
    await createRandomUser()
  }
  return res.status(200).json({ message: "seeded" })
})

app.use(express.static(path.join(__dirname, "public")))
//serve static file
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")))

//app routing
app.use("/api/v1", router)

//handle error whole app
app.use(errorHandling)

server.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`)
})
