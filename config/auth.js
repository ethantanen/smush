const passport = require('passport')
const LocalStrategy = require('passport-local')
const users = require('../models/users')

// setup LocalStrategy
passport.use(new LocalStrategy( (username, password, done) => {
  console.log('[INFO]', username, password)
  return users.select({username: username})
    .then(async (user) => {
      if (! await users.validatePasswordHash(password, user.password)) return done(null, false, {message: 'username or password incorrect'})
      return done(null, user)
    })
    .catch((err) => {
      done(null, null, {message: 'username or password inccorect'})
    })
}))

// serialize user using the user's username
passport.serializeUser((user, done) => {
  done(null, user.username)
})

// deserialize user by querying database by username
passport.deserializeUser((username, done) => {
  users.select({username: username})
    .then((user) => {
      return done(null, user)
    })
    .catch((err) => {
      return done(err)
    })
})
