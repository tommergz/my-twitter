const router = require('express').Router()
const tweetModel = require('../../Model/Tweets/Tweets')
const userModel = require('../../Model/User/User')
const cloudinary = require('cloudinary').v2
const Formidable = require('formidable')
require('dotenv').config()
const {getMails} = require('../../Tools/Nodemailer/Nodemailer');

router.get("/comments/:id", async (request, response) => {
  const tweet_id = request.params.id
  await tweetModel.findOne({ _id: tweet_id })
    .then((data) => {
      return response.status(200).json(data)
    })
    .catch((error) => {
      console.log(error);
    })
})

const commentsUpdate = async (tweet_id, comments, response, commentText=null) => {
  await tweetModel.findById(tweet_id, async (err, updatedComment) => {
    updatedComment.comments = comments
    await updatedComment.save()
    if (commentText) {
      getMails(commentText)
    }
    return response.status(200).json(comments)
  })
}

router.post("/comments/:id", async (request, response) => {
  const tweet_id = request.params.id
  const tweet = await tweetModel.findOne({ _id: tweet_id })

  const form = new Formidable.IncomingForm()
  form.parse(request, async (error, fields, files) => {
    const { commentText, currentUser } = fields
    const { file } = files
    const comment = {}
    const user = await userModel.findOne({username: currentUser})
    comment.id = +Date.now().toString()
    comment.user = currentUser
    comment.profile = user.profile_pic
    comment.text = commentText
    const comments = [...tweet.comments, comment]

    if (!file) {
      commentsUpdate(tweet_id, comments, response, commentText)
    } else {
      await cloudinary.uploader.upload(file.path, {folder: '/COMMENT/FILES'}, async (error, res) => {
        if (error) {
          console.log(error);
        }    
        comment.file = res.secure_url
        comment.file_id = res.public_id
        const comments = [...tweet.comments, comment]

        commentsUpdate(tweet_id, comments, response, commentText)
      })
    }
  })
})

router.put('/comment-update', async (request, response) => {
  const form = new Formidable.IncomingForm()
  form.parse(request, async (error, fields, files) => {
    const { tweetId, commentId, comment } = fields
    const { fileId } = fields
    const { file } = files

    const currentTweet = await tweetModel.findById(tweetId)
    const comments = currentTweet.comments
    const commentIndex = comments.findIndex(comment => +comment.id === +commentId)
    comments[commentIndex].text = comment

    if (!file && fileId) {
      commentsUpdate(tweetId, comments, response, comment)
    } else if (!file && !fileId) {
      await cloudinary.uploader.destroy(comments[commentIndex].file_id, async (error, res) => {
        if (error) {
          console.log(error);
        }
        comments[commentIndex].file = null
        comments[commentIndex].file_id = null
        commentsUpdate(tweetId, comments, response, comment)
      })
    } else if (file && !fileId) {
      await cloudinary.uploader.upload(file.path, {folder: '/COMMENT/FILES'}, async (error, res) => {
        if (error) {
          console.log(error);
        }
        comments[commentIndex].file = res.secure_url
        comments[commentIndex].file_id = res.public_id
        commentsUpdate(tweetId, comments, response, comment)
      })
    }
  })
})

router.delete('/comment-remove', async (request, response) => {
  const {tweetId, commentId}  = request.query 
  const currentTweet = await tweetModel.findById(tweetId)
  const comments = currentTweet.comments
  const commentIndex = comments.findIndex(comment => +comment.id === +commentId)
  const file = comments[commentIndex].file_id
  comments.splice(commentIndex, 1)
  if (!file) {
    commentsUpdate(tweetId, comments, response)
  } else {
    cloudinary.uploader.destroy(file, async (error, res) => {
      if (error) {
        console.log(error);
      }
      commentsUpdate(tweetId, comments, response)
    })
  }
})

module.exports = router