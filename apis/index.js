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
const handleSocket = require("./src/utils/socket.js")
const db = require("@config/db.js")
const { createRandomUser } = require("./src/utils/faker.js")

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
handleSocket(io)
app.use(cookies())

// apply middleware
app.use(
  cors({
    //    origin: "http://localhost:5173",
    origin: "https://fun-chat-red.vercel.app",
    credentials: true,
  }),
)
dotenv.config() // allow read environment variable in .env file
app.use(morgan("dev")) // automatically log comming requiest
app.use(bodyParser.urlencoded({ extended: false })) // parse application/-WWW-urlencoded
app.use(bodyParser.json()) // parse application/json

// use the PORT environment variable, or default to 8080
const PORT = process.env.PORT || 8080

//handle error whole app
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).send("something broke!")
})

app.post("/seed-data-user", async (req, res) => {
  for (let i = 0; i < 20; i++) {
    await createRandomUser()
  }
  return res.status(200).json({ message: "seeded" })
})

app.use(express.static(path.join(__dirname, "public")))

//app routing
app.use("/api/v1", router)

server.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`)
})
