const express = require("express")
const morgan = require("morgan")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const app = express()

// appl middleware
dotenv.config() // allow read environment variable in .env file
app.use(morgan("dev")) // automatically log comming requiest
app.use(bodyParser.urlencoded({ extended: false })) // parse application/-WWW-urlencoded
app.use(bodyParser.json()) // parse application/json
// use the PORT environment variable, or default to 8080
const PORT = process.env.PORT || 8080

app.get("/", (req, res) => {
  res.send("hello , world Expressjs")
})

app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`)
})
