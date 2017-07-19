const express = require('express')
const router = express.Router()
const path = require('path')
const config = require(path.join(__dirname, '../config'))
const Twit = require('twit')
const T = new Twit(config)
let tweets = []
let following = []
let DMs = []

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
  res.render('index', {tweets: tweets, friends: following, DMs: DMs} )
})

module.exports = router
