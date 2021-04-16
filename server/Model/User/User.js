const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  mail: {type: String, required: false, default: '', unique: true},
  password: { type: String, required: true },
  profile_pic: {type: String, required: false, default: null}
})

const userModel = mongoose.model("userModel", userSchema)

module.exports = userModel