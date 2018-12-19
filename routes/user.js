// published modules
const router = require('express').Router()
const uuid = require('uuid/v1');
const passport = require('passport')

// authentication middleware
const isAdmin = require('../utilities/checkAuth').isAdmin
const isUser = require('../utilities/checkAuth').isUser

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
  if (req.user) return res.render('home.ejs', {message: 'You\'re already logged in!', isLoggedIn: req.user})
  res.render('login.ejs', {message: req.flash('error'), isLoggedIn: false})
})

// endpoints for authenticating with facebook
router.get('/facebook-login', passport.authenticate('facebook', {scope: ['email']}))
router.get('/facebook-token', passport.authenticate('facebook',
{
  successRedirect: '/home',
  failureRedirect: '/user/login',
  failureFlash: true

}))

// endpoints for authenticating with twitter
router.get('/twitter-login', passport.authenticate('twitter',{ scope: ['include_email=true']}))
router.get('/twitter-token', passport.authenticate('twitter',
{
  successRedirect: '/home',
  failureRedirect: '/user/login',
  failureFlash: true
}))

// render sign up page
router.get('/signup', (req, res) => {
  if (req.user) return res.render('home.ejs', {message: 'You\'re already logged in', isLoggedIn: req.user})
  res.render('signup.ejs', {message: "", isLoggedIn: req.user})
})

// add new user to database and log them in
router.post('/insert', async (req, res) => {
  try {
    entry = await users.insert(format(req.body))
    req.login(entry, (err) => {
      res.render('home.ejs', {message: 'Welcome ' + entry.name, isLoggedIn: true})
    })
  } catch (err) {
    res.render('signup.ejs', {message: 'Username or password already taken!', isLoggedIn: false})
  }
})

// delete user
router.post('/remove', isUser, async (req, res) => {
  user = req.user
  try {
    meta = await users.remove(req.body._id)
    req.session.destroy((err) => {
      res.render('home.ejs', {message: user.name + ' has been deleted from the SMUSH community!', isLoggedIn: false})
    })
  } catch (err) {
    res.render('profile.ejs', {message: user.name + 'your account could not be deleted', isLoggedIn: req.user})
  }
})

// search database
router.get('/select', async (req, res) => {
  try {
    results = await users.select(format(req.query))
    res.send(results)
  } catch (err) {
    res.render('error.ejs')
  }
})

// update entry using primary key as locator
router.post('/update', async (req, res) => {

  /**
   * this function doesnt use the isUser middleware so that when a password reset
   * occurs the profile may be updated. Instead the program looks for a passport
   * entry in the session
  **/
  if (!req.user && !req.session.update) {
    return res.render('home.ejs', {isLoggedIn: req.user, message: 'You must be logged in to visit that link!'})
  }

  // if the passwords being updated convert it to a
  if (req.body.password) {
    req.body.password = await users.makePasswordHash(req.body.password)
    req.body.password = req.body.password.trim()
  }

  // seperate html form data to determine the item that needs updating
  // and the new information
  id = req.body._id.trim()
  delete req.body._id
  update = req.body

  // update entry
  try {
    entry = await users.update(id, format(update))
    res.render('profile.ejs', {message: 'Profile updated!', isLoggedIn: req.user, user: entry})
  } catch (err) {
    res.render('error.ejs')
  }
})

// render profile page
router.get('/profile', isUser, (req, res) => {
  res.render('profile.ejs', {message: '', isLoggedIn: req.user, user: req.user})
})

// render the page admins use to grant admin permissions
router.get('/admin-confirm', isAdmin, async (req, res) => {
  user = await users.select({'_id': req.query.user.trim()})
  res.render('admin-auth/admin-confirm.ejs', {message:'', isLoggedIn: req.user, user: user})
})

// render page to get user's email to send reset password link to user
router.get('/reset-password', (req, res) => {
  res.render('password-reset/password-reset-send-email.ejs', {isLoggedIn: req.user, message: ''})
})

// render page to type in new password
router.get('/reset-password-form', (req, res) => {
  req.session.update = true
  res.render('password-reset/reset-password.ejs', {isLoggedIn: req.user, message: '', _id: req.query.user})
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
