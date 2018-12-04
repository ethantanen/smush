// published modules
const router = require('express').Router()
const uuid = require('uuid/v1');
const passport = require('passport')

// import model
const users = require('../models/users')

// log a user in
// TODO: this is where we should store the users permissions in the session
router.post('/authenticate',
  passport.authenticate('local', {failureRedirect:'/login'}),
  (req, res) => {
    console.log('hre')
    res.send(req.user)
  })

// log a user off
router.get('/logoff', (req, res) => {
  req.logout()
  req.redirect('/')
})

// authenticate user
router.get('/login', (req, res) => {
  res.render('login.ejs')

})

// add new user to database
router.post('/insert', async (req, res) => {
  try {
    entry = await users.insert(format(req.body))
    res.send('sucess')
  } catch (err) {
    res.send('something went wrong!')
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
