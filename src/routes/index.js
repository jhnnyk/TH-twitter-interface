const express = require('express')
const http = require('http')
const app = express()
const server = app.listen(8810)
const io = require('socket.io').listen(server)
// server.listen(3000)

const router = express.Router()
const path = require('path')
const config = require(path.join(__dirname, '../config'))
const Twit = require('twit')
const T = new Twit(config)

// variables to send to Pug template
let tweets = []
let following = []
let DMs = []
let currentUser = {}

// get current users info
T.get('account/verify_credentials', (err, data, response) => {
  currentUser.screen_name = data.screen_name
  currentUser.profile_img = data.profile_image_url
  currentUser.bg_img = data.profile_banner_url
  currentUser.friends_count = data.friends_count
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

// stream timeline updates
//
//  stream a sample of public statuses
//
// let stream = T.stream('user')

// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })

router.get('/', (req, res) => {
  res.render('index', {
    tweets: tweets, 
    friends: following, 
    DMs: DMs,
    currentUser: currentUser
  } )
})

router.post('/tweet', (req, res) => {
  T.post('statuses/update', { status: req.body.tweetText } )
  res.redirect('/')
})

// set up streaming feed

let stream = T.stream('user')

io.on('connect', (socket) => {
  stream.on('tweet', (tweet) => {
    let data = {}
    data.name = tweet.user.name
    data.screen_name = tweet.user.screen_name
    data.text = tweet.text
    data.profile_img = tweet.user.profile_image_url
    socket.emit('tweets', data)
  })
})

module.exports = router
