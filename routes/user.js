// published modules
const router = require('express').Router()
const uuid = require('uuid/v1');
const passport = require('passport')

// import model
const users = require('../models/users')


// TODO:
// where should a user be redirected if theyre already logged in and visit the log in page?
//

// log a user in
// TODO: this is where we should store the users permissions in the session
router.post('/authenticate', passport.authenticate('local',
  {
    successRedirect: '/home',
    failureRedirect: '/user/login',
    failureFlash: true
  }), (req, res) => {console.log('yo')}
)

// log a user off
router.get('/logout', (req, res) => {
  if (!req.user) return res.redirect('/home')
  user = req.user
  req.session.destroy((err) => {
    res.render('home.ejs', {message: user.name + ' has been logged out of SMUSH!', isLoggedIn: false})
  })
})

// authenticate user
router.get('/login', (req, res) => {
  if (req.user) return res.render('home.ejs', {message: 'You\'re already logged in!', isLoggedIn: true})
  res.render('login.ejs', {message: req.flash('error'), isLoggedIn: req.user})
})

router.get('/signup', (req, res) => {
  if (req.user) return res.render('home.ejs', {message: 'You\'re already logged in', isLoggedIn: true})
  res.render('signup.ejs', {message: "", isLoggedIn: req.user})
})

// add new user to database and log them in
router.post('/insert', async (req, res) => {
  try {
    entry = await users.insert(format(req.body))
    req.login({username: entry.username, password: entry.password}, (err) => {
      res.redirect('/home')
    })
  } catch (err) {
    res.render('signup.ejs', {message: 'Username already taken!', isLoggedIn: req.user})
  }
})

// delete user
router.get('/remove', async (req, res) => {
  // TODO: convert '' to null to delete entries where the field doesnt exist/ is empty
  try {
    meta = await users.remove(format(req.query))
    res.send('success')
  } catch (err) {
    res.send('something went wrong')
  }
})

// search database
router.get('/select', async (req, res) => {
  try {
    results = await users.select(format(req.query))
    res.send(results)
  } catch (err) {
    res.status(404).send('something went wrong')
  }
})

// update entry
router.post('/update', async (req, res) => {
  // seperate html form data to determine the item that needs updating
  // and the new information
  oldEntry = {}
  newEntry = {}
  for (key in req.body) {
    if (key.slice(-1) == 'O') {
      oldEntry[key.slice(0,-1)] = req.body[key]
    } else {
      newEntry[key.slice(0,-1)] = req.body[key]
    }
  }

  // update entry
  try {
    entry = await users.update(format(oldEntry), format(newEntry))
    res.send(entry)
  } catch (err) {
    console.log(err)
    res.send('something went wrong')
  }
})

// remove property where value is ''
function format(query) {
  for (key in query) {
    if (query[key] === '') {
      delete query[key]
    }
  }
  return query
}

module.exports = {
  router: router
}
