// published modules
const upload = require('multer')({dest:'upload/'})
const fs = require('fs')
const router = require('express').Router()
const mongoose = require('mongoose')

// import model
const music = require('../models/music')


// TODO: check permissions
router.get('/upload', async (req, res) => {
  db = await music.select(format(req.query))
  res.render('upload.ejs', {isLoggedIn: req.user, message: '', db: db})
})

// make new entry using an image
// TODO: should be an insert/ from-html-form type thing
router.post('/insert', upload.array('file', [2]), async (req, res) => {

  // parse file from request and convert to base64
  image = fs.readFileSync(req.files[0].path)
  image_64 = new Buffer(image).toString('base64')

  midi = fs.readFileSync(req.files[1].path)
  midi_64 = new Buffer(midi).toString('base64')

  req.body.image = image_64
  req.body.midi = midi_64

  // insert file into music database
  try {
    entry = await music.insert(format(req.body))
    res.render("home.ejs", {isLoggedIn: req.user, message:"Entry successfully uploaded"})
  } catch (err) {
    res.render("home.ejs", {isLoggedIn: req.user, message:"Could not insert entry!"})
  }
})

// delete entry
router.post('/remove', async (req, res) => {
  try {
    meta = await music.remove(format(req.body._id.trim()))
    db = await music.select({})
    res.render('upload.ejs', {isLoggedIn: req.user, message: 'Entry Deleted', db: db})
  } catch (err) {
    console.log(err)
    res.send('something went wrong')
  }
})

// render archive-entry view
router.get('/archive-entry*', async (req, res) => {
  data = await music.select(req.query)
  res.render('archive-entry.ejs', {data: data[0], isLoggedIn: req.user, message:''})
})

// search database w/ specific values
router.get('/select', async (req, res) => {
  try {
    results = await music.select(format(req.query))
    res.render('results.ejs', {data: results, isLoggedIn: req.user})
  } catch (err) {
    res.status(404).render('error.ejs')
  }
})

// search database by phrase
router.get('/search', async (req, res) => {
  try {
    results = await music.search(req.query.search)
    res.render('results.ejs', {data: results, isLoggedIn: req.user})
  } catch (err) {
    res.status(404).render('error.ejs')
  }
})

// update entry
router.post('/update', async (req, res) => {

  id = req.body._id.trim()
  delete req.body._id
  update = req.body

  // update entries in database
  try {
    entry = await music.update(id, format(update))
    delete entry.image
    delete entry.midi

    db = await music.select({})

    res.render('upload.ejs', {isLoggedIn: req.user, message: 'New Entry: ' + JSON.stringify(entry) , db: db})
  } catch (err) {
    console.log(err)
    res.send('something went wrong')
  }
})

//NOTE we can remove any sort of malformed entry --> ['', ' ', 'poop'].includes(query[key])
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
