// published modules
const upload = require('multer')({dest:'upload/'}).fields([{name: 'image', maxCount: 1}, {name: 'music', maxCount: 1}])
const fs = require('fs')
const router = require('express').Router()
const mongoose = require('mongoose')
const fileType = require('file-type')

// authentication middleware
const isAdmin = require('../utilities/checkAuth').isAdmin
const isUser = require('../utilities/checkAuth').isUser

// import model
const music = require('../models/music')

// insert entry into music model
router.post('/insert', isAdmin, upload, async (req, res) => {

  // parse file from request and convert to base64
  req.body.image = read64(req.files.image[0].path, 'image')

  // reject insert if there isn't a valid image
  if (!req.body.image) {
    return res.render("upload.ejs", {isLoggedIn: req.user, message: "You must input a valid image!"})
  }

  // music files are optional so check to see if it exists!
  if (req.files.music) {
    req.body.midi = read64(req.files.music[0].path, 'audio')
    if (!req.body.midi) {
      return res.render("upload.ejs", {isLoggedIn: req.user, message: "Music file is of an invalid type! Check tooltip for valid types."})
    }
  }

  // insert file into music model
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
    res.render('error.js', {isLoggedIn: req.user, message: ''})
  }
})

// update entry in music model
router.post('/update', isAdmin, upload, async (req, res) => {

  // parse image from request and convert to base64
  if(req.files.image) {
    req.body.image = read64(req.files.image[0].path, 'image')
    if (!req.body.image) {
      return res.render("upload.ejs", {isLoggedIn: req.user, message: "The image you uploaded is not of a valid type!"})
    }
  }

  // parse music file from request and convert to base64
  if(req.files.music) {
    req.body.midi = read64(req.files.music[0].path, 'audio')
    if (!req.body.midi) {
      return res.render("upload.ejs", {isLoggedIn: req.user, message: "Music file is of an invalid type! Check tooltip for valid types."})
    }
  }

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
    res.render('error.ejs', {isLoggedIn: req.user, message: ''})
  }
})

// search music model w/ specific values
router.get('/select', async (req, res) => {
  try {
    results = await music.select(format(req.query))
    res.render('results.ejs', {data: results, isLoggedIn: req.user})
  } catch (err) {
    console.log(err)
    res.render('error.ejs', {isLoggedIn: req.user, message: ''})
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
    res.render('error.ejs', {isLoggedIn: req.user, message: ''})
  }
})

// render archive-entry view
router.get('/archive-entry*', async (req, res) => {
  data = await music.select(req.query)
  res.render('archive-entry.ejs', {data: data[0], isLoggedIn: req.user, message:''})
})

// render sheetmusic view
router.get('/sheetmusic*', async (req, res) => {
  data = await music.select(req.query)
  res.render('sheetmusic.ejs', {data: data[0], isLoggedIn: req.user, message:''})
})

// render image of sheet music
router.get('/image*', async (req, res) => {
  data = await music.select(req.query)
  res.render('image.ejs', {data: data[0], isLoggedIn: req.user, message:''})
})

// render upload entry view
router.get('/admin', isAdmin, async (req, res) => {
  db = await music.select(format(req.query))
  res.render('upload.ejs', {isLoggedIn: req.user, message: '', db: db})
})

/**
 * read a file from the filesystem, check if the file is of the type specified
 * and convert the file to base64
**/
function read64(path, type) {

  // determine which MIME types are valid
  validTypes = []
  if (type === 'image') {
    validTypes = ['image/jpeg', 'image/png']
  } else if (type === 'audio') {
    validTypes = ['audio/wav', 	'audio/ogg', 'audio/mpeg']
  }

  // read in file
  file = fs.readFileSync(path)
  fileT = fileType(file)

  // check if file is not of a valid type
  if (!fileT || !validTypes.includes(fileT.mime)) {
    return undefined
  } else {
    return new Buffer(file).toString('base64')
  }
}

// NOTE: remove any sort of malformed entry --> ['', ' ', 'poop'].includes(query[key])
// remove property where value is ''
function format(query) {
  for (key in query) {
    if (query[key].trim() === '') {
      delete query[key]
    }
  }
  return query
}

module.exports = {
  router: router
}
