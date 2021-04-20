const router = require('express').Router()
const userModel = require('../../Model/User/User')
const Formidable = require('formidable')
const Bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
const JWT = require('jsonwebtoken')
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
})

router.post('/user-register', (request, response) => {
  const form = new Formidable.IncomingForm()
  form.parse(request, async (error, fields, files) => {
    const {username, mail, password, verifiedPassword} = fields
    const {profileImage} = files
    if (!username || !password || !verifiedPassword) {
      return response
        .status(400)
        .json({msg:'Username, password and verified password fields have to be entered'})
    }

    if (password !== verifiedPassword) {
      return response
        .status(400)
        .json({msg:'The password and confirm password fields do not match'})
    }

    const user = await userModel.findOne({username:username})
    if (user) {
      return response.status(400).json({msg:'User with this username already exists'})
    }

    if (profileImage) {
      cloudinary.uploader.upload(
        profileImage.path,
        { folder: "/Twitter-Clone/profiles"},
        async (error, res) => {
          if (error) {
            return console.log(error)
          }
          try {
            const profileIamge_url = res.secure_url
            const salt = await Bcrypt.genSalt(15)
            const hasehedPassword = await Bcrypt.hash(password, salt)
            const newUser = new userModel({
              username,
              mail,
              password: hasehedPassword,
              profile_pic: profileIamge_url
            })
            const savedUser = await newUser.save()
  
            const token = JWT.sign({ id: savedUser._id }, process.env.jwt_secret)
          
            return response
              .status(201)
              .json({token:token, profile_pic:savedUser.profile_pic})
          } catch (e) {
            console.log(e.message);
          }
        }
      )
    } else {
      try {
        const salt = await Bcrypt.genSalt(15)
        const hasehedPassword = await Bcrypt.hash(password, salt)
        const newUser = new userModel({
          username,
          mail,
          password: hasehedPassword,
        })
        const savedUser = await newUser.save()

        const token = JWT.sign({ id: savedUser._id }, process.env.jwt_secret)
      
        return response
          .status(201)
          .json({token:token, profile_pic:savedUser.profile_pic})
      } catch (e) {
        console.log(e.message);
      }
    }
  })
})

router.post("/user-login", (request, response) => {
  const form = new Formidable.IncomingForm()
  form.parse(request, async (error, fields, files) => {
    const {username, password} = fields

    if (!username || !password) {
      return response.status(400).json({msg:'All fields have to be entered'})
    }

    const user = await userModel.findOne({username:username})

    if (!user) {
      return response.status(400).json({msg:'No user with this username'})
    }

    const validatedPassword = await Bcrypt.compare(password, user.password)

    if (!validatedPassword) {
      return response.status(400).json({msg:'Invalid credentials'})
    }

    const token = JWT.sign({ id: user._id }, process.env.jwt_secret)

    return response
      .status(200)
      .json({ token: token, profile_pic: user.profile_pic })
  })
})

module.exports = router