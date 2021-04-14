const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_pic: {type: String, required: true}
})

const userModel = mongoose.model("userModel", userSchema)

module.exports = userModel