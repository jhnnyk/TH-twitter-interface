const express = require('express')
const router = express.Router()
const path = require('path')
const config = require(path.join(__dirname, '../config'))
const Twit = require('twit')
const T = new Twit(config)
let tweets = []

T.get('statuses/home_timeline', { count: 5 }, (err, data, response) => {
  tweets = data
})

router.get('/', (req, res) => {
  res.render('index', {tweets: tweets} )
})

module.exports = router
