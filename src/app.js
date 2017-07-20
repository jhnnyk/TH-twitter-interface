const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
// const io = require('socket.io').listen(server)

const bodyParser = require('body-parser')

app.locals.moment = require('moment')
app.use(bodyParser.urlencoded({extended: false}))
app.use('/static', express.static(__dirname + '/public'))

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

const mainRoutes = require('./routes')

app.use(mainRoutes)

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.locals.error = err
  res.status(err.status)
  res.render('error', err)
})

server.listen(3000, () => {
  console.log('The app is running on localhost:3000!')
})
