const router = require('express').Router()
const userModel = require('../../Model/User/User')
const cloudinary = require('cloudinary').v2
const JWT = require('jsonwebtoken')
const Formidable = require('formidable')
require('dotenv').config()

router.get("/users", async (request, response) => {
  await userModel
    .find()
    .exec()
    .then((data) => {
      return response.status(200).json(data)
    })
    .catch((error) => {
      console.log(error);
    })
})

module.exports = router