const passport = require('passport')
const LocalStrategy = require('passport-local')
const users = require('../models/users')

// setup LocalStrategy
passport.use(new LocalStrategy( (username, password, done) => {
  return users.select({username: username})
    .then((user) => {
      console.log(user, password, user.password)
      if (password != user.password) return done(null, false)
      return done(null, user)
    })
    .catch((err) => {
      done(null, null)
    })
}))

// serialize user using the user's username
passport.serializeUser((user, done) => {
  done(null, user.username)
})

// deserialize user by querying database by username
passport.deserializeUser((username, done) => {
  users.findOne({username: username})
    .then((user) => {
      return done(null, user)
    })
    .catch((err) => {
      return done(err)
    })
})
