const router = require('express').Router()
const tweetModel = require('../../Model/Tweets/Tweets')
const userModel = require('../../Model/User/User')
const cloudinary = require('cloudinary').v2
const JWT = require('jsonwebtoken')
const Formidable = require('formidable')
require('dotenv').config()

router.post('/tweet-upload', async (request, response) => {
  const token = request.header('x-auth-token')
  const verifiedToken = JWT.verify(token, process.env.jwt_secret)
  const user_id = verifiedToken.id
  const user = await userModel.findOne({_id:user_id})
  const form = new Formidable.IncomingForm()
  form.parse(request, async (error, fields, files) => {
    const { tweet } = fields
    const { file } = files

    if (!file) {
      const newTweet = new tweetModel({
        user: user.username,
        tweet: tweet,
        profile: user.profile_pic
      })

      await newTweet.save()

    } else {
      await cloudinary.uploader.upload(file.path, {folder: '/TWEET/FILES'}, async (error, res) => {
        if (error) {
          console.log(error);
        }
        const file_url = res.secure_url
        const cloudinary_id = res.public_id

        const newTweet = new tweetModel({
          user: user.username,
          tweet: tweet,
          profile: user.profile_pic,
          file: file_url,
          file_id: cloudinary_id
        })

        await newTweet.save()
      })
    }
    return response.status(200).json({msg: 'TWEET HAS SENT!'})
  })
})

router.put('/tweet-update', async (request, response) => {
  const form = new Formidable.IncomingForm()
  form.parse(request, async (error, fields, files) => {
    const { tweet, tweetId } = fields
    const { fileId } = fields
    const { file } = files

    const currentTweet = await tweetModel.findById(tweetId)

    if (!file && fileId) {
      await tweetModel.findById(tweetId, async (err, updatedTweet) => {
        updatedTweet.tweet = tweet
        await updatedTweet.save()
        return response.status(200).json({msg: 'Tweet has updated'})
      })
    } else if (!file && !fileId) {
      await cloudinary.uploader.destroy(currentTweet.file_id, async (error, res) => {
        if (error) {
          console.log(error);
        }
        await tweetModel.findById(tweetId, async (err, updatedTweet) => {
          updatedTweet.tweet = tweet
          updatedTweet.file = null
          updatedTweet.file_id = null
          await updatedTweet.save()
          return response.status(200).json({msg: 'Tweet has updated'})
        })
      })
    } else if (file && !fileId) {
      await cloudinary.uploader.upload(file.path, {folder: '/TWEET/FILES'}, async (error, res) => {
        if (error) {
          console.log(error);
        }
        const file_url = res.secure_url
        const cloudinary_id = res.public_id
        await tweetModel.findById(tweetId, async (err, updatedTweet) => {
          updatedTweet.tweet = tweet
          updatedTweet.file = file_url
          updatedTweet.file_id = cloudinary_id
          await updatedTweet.save()
          return response.status(200).json({msg: 'Tweet has updated'})
        })
      })
    }
  })
})

router.delete('/tweet-remove', async (request, response) => {
  const {id, file}  = request.query

  if (!file) {
    await tweetModel.findByIdAndRemove(id).exec()
    return response.status(200).json({msg: 'Tweet has deleted'})
  } else {
    cloudinary.uploader.destroy(file, async (error, res) => {
      if (error) {
        console.log(error);
      }
      await tweetModel.findByIdAndRemove(id).exec()
      return response.status(200).json({msg: 'Tweet has deleted'})
    })
  }
})

router.get("/tweets", async (request, response) => {
  await tweetModel
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