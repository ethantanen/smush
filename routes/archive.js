// published modules
const upload = require('multer')({dest:'upload/'})
const fs = require('fs')
const router = require('express').Router()
const mongoose = require('mongoose')

// authentication middleware
const isAdmin = require('../utilities/checkAuth').isAdmin
const isUser = require('../utilities/checkAuth').isUser

// import model
const music = require('../models/music')

// insert entry into music model
// TODO: neaten by determining which file is name midi and the other image, check extension
router.post('/insert', isAdmin, upload.array('file', [2]), async (req, res) => {

  // parse file from request and convert to base64
  image = fs.readFileSync(req.files[0].path)
  image_64 = new Buffer(image).toString('base64')

  midi = fs.readFileSync(req.files[1].path)
  midi_64 = new Buffer(midi).toString('base64')

  req.body.image = image_64
  req.body.midi = midi_64

  // insert fi le into music model
  try {
    entry = await music.insert(format(req.body))
    db = await music.select({})
    res.render("upload.ejs", {isLoggedIn: req.user, message:"Entry successfully uploaded", db: db})
  } catch (err) {
    res.render("upload.ejs", {isLoggedIn: req.user, message:"Could not insert entry!"})
  }
})

// delete entry from music model
router.post('/remove', isAdmin, async (req, res) => {
  try {
    meta = await music.remove(format(req.body._id.trim()))
    db = await music.select({})
    res.render('upload.ejs', {isLoggedIn: req.user, message: 'Entry Deleted', db: db})
  } catch (err) {
    res.render('error.js')
  }
})

// update entry in music model
router.post('/update', isAdmin, async (req, res) => {

  // seperate the id of the entry and the properties to be updated
  id = req.body._id.trim()
  delete req.body._id
  update = req.body

  try {

    // update model
    entry = await music.update(id, format(update))

    // prepare information for rendering and render the admin page
    db = await music.select({})
    res.render('upload.ejs', {isLoggedIn: req.user, message: 'Entry Updated: ' + entry.artistName + ', ' + entry.trackName , db: db})

  } catch (err) {
    res.render('error.ejs')
  }
})

// search music model w/ specific values
router.get('/select', async (req, res) => {
  try {
    results = await music.select(format(req.query))
    res.render('results.ejs', {data: results, isLoggedIn: req.user})
  } catch (err) {
    res.render('error.ejs')
  }
})

// search database by phrase
router.get('/search', async (req, res) => {
  try {
    // accommodate full database results w/ query --> ''
    if (req.query.search === '') {
      results = await music.select({})
    } else {
      results = await music.search(req.query.search)
    }
    res.render('results.ejs', {data: results, isLoggedIn: req.user})
  } catch (err) {
    res.status(404).render('error.ejs')
  }
})

// render archive-entry view
router.get('/archive-entry*', async (req, res) => {
  data = await music.select(req.query)
  res.render('archive-entry.ejs', {data: data[0], isLoggedIn: req.user, message:''})
})

//render sheetmusic view
router.get('/sheetmusic*', async (req, res) => {
  data = await music.select(req.query)
  res.render('sheetmusic.ejs', {data: data[0], isLoggedIn: req.user, message:''})
})

router.get('/image*', async (req, res) => {
  data = await music.select(req.query)
  res.render('image.ejs', {data: data[0], isLoggedIn: req.user, message:''})
})

// render upload entry view
router.get('/admin', isAdmin, async (req, res) => {
  db = await music.select(format(req.query))
  res.render('upload.ejs', {isLoggedIn: req.user, message: '', db: db})
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
