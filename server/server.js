const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
})
require("dotenv").config()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

const mongoURI = process.env.mongoURI
const mongoConnectionEssentials = {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect(mongoURI, mongoConnectionEssentials, (err) => {
  // mongoose.connection.collections.usermodels.drop()
  if (err) {
    return console.log(err)
  }
  return console.log("Connection to MongoDB is good");
})

app.use(require("./Routes/Auth/UserAuth"))
app.use(require("./Routes/Users/Users"))
app.use(require("./Routes/Tweets/Tweets"))
app.use(require("./Routes/Comments/Comments"))

io.on('connection', socket => {
  socket.on('tweets', (tweets) => {
    io.emit('tweets', tweets)
  })
  socket.on('comments', (comments) => {
    io.emit('comments', comments)
  })
})

const PORT = process.env.PORT || 5000

http.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
})