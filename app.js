// published modules
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const https = require('https')
const logger = require('morgan')
const session = require('express-session')
const auth = require('./config/auth')
const passport = require('passport')
const flash = require('connect-flash')

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

// add middleware
app.use(bodyParser({limit: '50mb'}))
app.use(express.static(__dirname + '/static'))
app.use(logger('dev'))
app.use(session({secret: 'guccipancakes', cookie: {secure: false}}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

// TODO: delete this!
app.use((req, res, next) => {
  //console.log('\nSESSION:', req.session, '\nBODY:', req.body, '\nUSER:', req.user)
  next()
})

// TESTING TESTING TESTING
app.get('/index', (req, res) => {
  res.render('index.ejs')
})


// connect routers
app.use('/user', user.router)
app.use('/contact', contact.router)
app.use('/archive', archive.router)

// render homescreen/ redirect unmatched urls to homescreen
app.all('/*', (req, res) => {
  res.render('home.ejs', {isLoggedIn:req.user, message: ""})
})
