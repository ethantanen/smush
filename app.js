// published modules
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const https = require('https')
const logger = require('morgan')
const cors = require('cors')

// require routes
const addUser = require('./routes/addUser')
const admin = require('./routes/admin')
const user = require('./routes/user')
const contact = require('./routes/contact')

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
app.use(bodyParser({
  limit: '50mb'
}))
app.use(express.static(__dirname + '/static'))
app.use(logger('dev'))
app.use(cors())

// connect routers
app.use('/addUser', addUser.router)
app.use('/admin', admin.router)
app.use('/user', user.router)
app.use('contact', contact.router)

// render homescreen/ redirect unmatched urls to homescreen
app.all('*', (req, res) => {
  res.render('index.ejs')
})
