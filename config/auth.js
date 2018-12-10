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
  clientID: process.env.FACEBOOK_CLIENTID,
  clientSecret: process.env.FACEBOOK_CLIENTSECRET,
  callbackURL: process.env.FACEBOOK_CALLBACKURL,
  profileFields: ['id', 'emails', 'displayName']
}, (accessToken, refreshToken, profile, done) => {

  return users.select({facebookId: profile.id})
    .then((user) => {
      return done(null, user, {message: user})
    })
    .catch((err) => {
      return users.insert({facebookId: profile.id, name: profile.displayName, email: profile.emails[0].value, permissions: 'User'})
        .then((user) => {return done(null, user, {message: user})})
    })
}))

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMERKEY,
  consumerSecret: process.env.TWITTER_CONSUMERSECRET,
  callbackURL: process.env.TWITTER_CALLBACKURL,

}, (token, tokenSecret, profile, done) => {
  return users.select({twitterId: profile.id})
    .then((user) => {
      return done(null, user, {message: user})
    })
    .catch((err) => {
      return users.insert({twitterId: profile.id, name: profile.displayName, permissions: 'User'})
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
