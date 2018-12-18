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
app.use(logger('[INFO] :method :url :status :res[content-length] - :response-time ms'))
app.use(session({secret: 'guccipancakes', cookie: {secure: false}}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

// connect routers
app.use('/user', user.router)
app.use('/contact', contact.router)
app.use('/archive', archive.router)

// render about page
app.get('/about', (req, res) => {
  res.render('about.ejs', {isLoggedIn: req.user, message:""})
})

// render home page
app.get(['/home', '/'], (req, res) => {
  res.render('home.ejs', {isLoggedIn:req.user, message: ""})
})

// redirect unmatched urls error page
app.all(['*', '/error'], (req, res) => {

// catch any errors that havent been caught
app.on('error', (err) => {
  res.render('error.ejs', {isLoggedIn:req.user, message: ""})
});

// start sesrver as http if http argument is passed in
if (process.argv[2] === 'http') {

  //spin up server on port 3000
  server = app.listen(PORT, (err) => {
    if (err) { return console.log(err) }
    host = server.address().address
    port = server.address().port
    console.log('listening on port %s --> http://%s:%s', port, host, port)
  })

} else {

  // spin up https server on port 8000
  server = https.createServer({
      key: fs.readFileSync('./config/https/server.key'),
      cert: fs.readFileSync('./config/https/server.crt')
    }, app)
    .listen(PORT, (err) => {
      if (err) return console.log(err)
      host = server.address().address
      port = server.address().port
      return console.log('Listening on port %s --> https://%s:%s', port, host,port)
    })

}
