const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const users = require('../models/users')
const ObjectId = require('mongoose').ObjectId

// TODO: link accounts by checking if the email exists

// setup LocalStrategy
passport.use(new LocalStrategy( (username, password, done) => {
  return users.select({username: username})
    .then(async (user) => {
      if (! await users.validatePasswordHash(password, user.password)) return done(null, false, {message: 'username or password incorrect'})
      return done(null, user)
    })
    .catch((err) => {
      done(null, null, {message: 'username or password inccorect'})
    })
}))

passport.use(new FacebookStrategy({
  clientID: '342802929843522',
  clientSecret: 'c9a7ecfc28b10fffb1e13a60258687c2',
  callbackURL: 'http://localhost:3000/user/facebook-token',
  profileFields: ['id', 'emails', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
  return users.select({facebookId: profile.id})
    .then((user) => {
      return done(null, user, {message: user})
    })
    .catch((err) => {
      return users.insert({facebookId: profile.id, name: profile.displayName, email: profile.emails[0].value})
        .then((user) => {return done(null, user, {message: user})})
    })
}))

passport.use(new TwitterStrategy({
  consumerKey: 'lUReLL1gN7FSolcFtwamG4emf',
  consumerSecret: 'khHCpKvCsAumbJnnSFkTT7UIkSI5VHQjiDnXCo3HeNRJod4fr3',
  callbackURL: 'http://localhost:3000/user/twitter-token'

}, (token, tokenSecret, profile, done) => {
  return users.select({twitterId: profile.id})
    .then((user) => {
      return done(null, user, {message: user})
    })
    .catch((err) => {
      return users.insert({twitterId: profile.id, name: profile.displayName, })
        .then((user) => { return done(null, user, {message: user})})
    })
}))

// serialize user using the user's username
passport.serializeUser((user, done) => {
  done(null, user._id)
})

// deserialize user by querying database by username
passport.deserializeUser((id, done) => {
  users.select({_id: id})
    .then((user) => {
      return done(null, user)
    })
    .catch((err) => {
      return done(err)
    })
})
