const mongoose = require("mongoose")

const tweetSchema = mongoose.Schema({
  user: { type: String, required: true },
  tweet: { type: String, required: true },
  profile: { type: String, required: true },
  file: { type: String, required: false, default: null },
  file_id: { type: String, required: false, default: null},
  likes: { type: Number, required: false, default: 0 },
  comments: { type: Array, required: false, default: [] },
  date: { type: Number, required: true }
})

const tweetModel = mongoose.model("tweetModel", tweetSchema)

module.exports = tweetModel