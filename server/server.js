const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
require("dotenv").config()

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
app.use(require("./Routes/Tweets/Tweets"))
app.use(require("./Routes/Users/Users"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
})