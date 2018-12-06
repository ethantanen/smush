// published modules
const upload = require('multer')({dest:'upload/'})
const fs = require('fs')
const router = require('express').Router()

// import model
const music = require('../models/music')

// make new entry using an image
// TODO: should be an insert/ from-html-form type thing
router.post('/insert/photo', upload.single('file'), async (req, res) => {

  // parse file from request and convert to base64
  file = fs.readFileSync(req.file.path)
  file_64 = new Buffer(file).toString('base64')

  req.body.image = file_64

  // insert file into music database
  try {
    entry = await music.insert(format(req.body))
    res.render("index.ejs", {isLoggedIn: req.user, message:"File successfully uploaded"})
  } catch (err) {
    res.send("index.ejs", {isLoggedIn: req.user, message:"Something went wrong"})
  }
})

// delete user
router.get('/remove', async (req, res) => {
  try {
    meta = await music.remove(format(req.query))
    res.send('success')
  } catch (err) {
    res.send('something went wrong')
  }
})

// search database w/ specific values
router.get('/select', async (req, res) => {
  try {
    results = await music.select(format(req.query))
    console.log(format(req.query))
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
    console.log(err)
    res.status(404).render('error.ejs')
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

  // update entries in database
  try {
    entry = await music.update(format(oldEntry), (newEntry))
    res.send(entry)
  } catch (err) {
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
