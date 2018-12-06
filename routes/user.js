// published modules
const router = require('express').Router()
const uuid = require('uuid/v1');
const passport = require('passport')

// TODO: check that password matches before signin someone up

// import model
const users = require('../models/users')

// log a user in
router.post('/authenticate', passport.authenticate('local',
  {
    successRedirect: '/home',
    failureRedirect: '/user/login',
    failureFlash: true
}))

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

router.get('/facebook-login', passport.authenticate('facebook', {scope: ['email']}))
router.get('/facebook-token', passport.authenticate('facebook',
{
  successRedirect: '/home',
  failureRedirect: '/user/login',
  failureFlash: true

}))

router.get('/twitter-login', passport.authenticate('twitter'))
router.get('/twitter-token', passport.authenticate('twitter',
{
  successRedirect: '/home',
  failureRedirect: '/user/login',
  failureFlash: true
}))

router.get('/signup', (req, res) => {
  if (req.user) return res.render('home.ejs', {message: 'You\'re already logged in', isLoggedIn: true})
  res.render('signup.ejs', {message: "", isLoggedIn: req.user})
})

router.get('/reset-password', (req, res) => {
  res.render('reset-password.ejs', {isLoggedIn: req.user})
})
// add new user to database and log them in
router.post('/insert', async (req, res) => {
  try {
    entry = await users.insert(format(req.body))
    req.login(entry, (err) => {
      res.render('home.ejs', {message: 'Welcome ' + entry.name, isLoggedIn: true})
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

router.get('/profile', (req, res) => {
  res.render('profile.ejs', {message: '', isLoggedIn: req.user, user: req.user})
})

// update entry
router.post('/update', async (req, res) => {
  // seperate html form data to determine the item that needs updating
  // and the new information
  console.log(req.body)
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
