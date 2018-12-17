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

// either localhost 3000 or the servers default port
const PORT = process.env.PORT || 3000

// create app
app = express()

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

// TODO: delete this!/ make an info flag that prints all available pritnouts
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
app.get('/about', (req, res) => {
  res.render('about.ejs', {isLoggedIn: req.user, message:""})
})

// render homescreen/ redirect unmatched urls to homescreen
app.all('/*', (req, res) => {
  res.render('home.ejs', {isLoggedIn:req.user, message: ""})
})

// start sesrver as http if http argument is passed in
if (process.argv[2] === 'http') {

  //start server on port 3000
  server = app.listen(PORT, (err) => {
    if (err) { return console.log(err) }
    host = server.address().address
    port = server.address().port
    console.log('listening on port %s --> http://%s:%s', port, host, port)
  })

} else {

  // begin https server on port 8000
  server = https.createServer({
      key: fs.readFileSync('./config/server.key'),
      cert: fs.readFileSync('./config/server.crt')
    }, app)
    .listen(PORT, (err) => {
      if (err) return console.log(err)
      host = server.address().address
      port = server.address().port
      return console.log('Listening on port %s --> https://%s:%s', port, host,port)
    })

}
