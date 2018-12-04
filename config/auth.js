const passport = require('passport')
const LocalStrategy = require('passport-local')
const users = require('../models/users')

// setup LocalStrategy
passport.use(new LocalStrategy( (username, password, done) => {
  return users.select({username: username})
    .then(async (user) => {
      console.log(user, password, user.password)
      if (! await users.validatePasswordHash(password, user.password)) return done(null, false, {message: 'wrong username or password'})
      return done(null, user)
    })
    .catch((err) => {
      console.log('hello!!', err)
      done(null, null, {message: 'username doesn\'t exist'})
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
