// published modules
const router = require('express').Router()

// import model
const users = require('../models/users')

// make new entry using an image
// TODO: should be an insert/ from-html-form type thing
// NOTE: it just base64 encodes image and inserts into database
router.post('/insert', async (req, res) => {

  username = req.body.username
  password = null
  email = null
  name = null
  permissions = null

  // insert file into music database
  try {
    entry = await users.insert(username, password, email, name, permissions)
    res.send('sucess')
  } catch (err) {
    res.send('something went wrong!')
  }

})

// delete user
router.get('/remove', async (req, res) => {

  // TODO: convert '' to null to delete entries where the field doesnt exist/ is empty

  try {
    meta = await users.remove(req.query)
    res.send('success')
  } catch (err) {
    res.send('something went wrong')
  }
})

// search database
router.get('/select', async (req, res) => {
  try {
    results = await users.select(req.query)
    res.send(results)
  } catch (err) {
    res.status(404).send('something went wrong')
  }
})

// update entry
router.post('/update', async (req, res) => {

  // TODO: figure out way to parse old and new entry data
  oldName = {}
  newName = {}
  oldName.username = req.body.oldName
  newName.username = req.body.newName

  try {
    entry = await users.update(oldName, newName)
    res.send(entry)
  } catch (err) {
    res.send('something went wrong')
  }
})

module.exports = {
  router: router
}
