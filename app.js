// published modules
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const https = require('https')
const logger = require('morgan')
const session = require('express-session')

// setup databases
const music = require('./models/music')
const users = require('./models/users')
music.connect()
users.connect()

// require routes
const user = require('./routes/user')
const contact = require('./routes/contact')
const archive = require('./routes/archive')

// create app
app = express()

// start server on port 3000
app.listen(3000, (err) => {
  if (err) { return console.log(err) }
  console.log('listening on port 3000')
})

// set view engine
app.set('view engine', 'ejs')


// TESTING TESTING TESTING
app.get('/home', (req, res) => {
  res.render('home.ejs')
})

// add middleware
app.use(bodyParser({limit: '50mb'}))
app.use(express.static(__dirname + '/static'))
app.use(logger('dev'))
app.use(session({secret: 'guccipancakes'}))

// TODO: delete this!
app.use((req, res, next) => {
  //console.log('SESSION:', req.session, 'BODY', req.body)
  next()
})

// connect routers
app.use('/user', user.router)
app.use('/contact', contact.router)
app.use('/archive', archive.router)

// render homescreen/ redirect unmatched urls to homescreen
app.all('/*', (req, res) => {
  res.render('index.ejs')
})
