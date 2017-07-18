const express = require('express')
const app = express()
app.locals.moment = require('moment')

app.use('/static', express.static(__dirname + '/public'))

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

const mainRoutes = require('./routes')

app.use(mainRoutes)

app.listen(3000, () => {
  console.log('The app is running on localhost:3000!')
})
