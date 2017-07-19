const express = require('express')
const router = express.Router()
const path = require('path')
const config = require(path.join(__dirname, '../config'))
const Twit = require('twit')
const T = new Twit(config)

// variables to send to PUG template
let tweets = []
let following = []
let DMs = []
let currentUser = {}

// get current users info
T.get('account/verify_credentials', (err, data, response) => {
  currentUser.screen_name = data.screen_name
  currentUser.profile_img = data.profile_image_url
  currentUser.bg_img = data.profile_background_image_url
  currentUser.friends_count = data.friends_count
  console.log(data)
})

// get timeline
T.get('statuses/home_timeline', { count: 5 }, (err, data, response) => {
  tweets = data
})

// get friends list
T.get('friends/list', { count: 5 }, (err, data, response) => {
  following = data.users
})

// get direct messages
T.get('direct_messages', { count: 5 }, (err, data, response) => {
  DMs = data
})

router.get('/', (req, res) => {
  res.render('index', {
    tweets: tweets, 
    friends: following, 
    DMs: DMs,
    currentUser: currentUser
  } )
})

module.exports = router
