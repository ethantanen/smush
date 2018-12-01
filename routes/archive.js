// published modules
const upload = require('multer')({dest:'upload/'})
const fs = require('fs')
const router = require('express').Router()

// import model
const music = require('../models/music')

// make new entry using an image
// TODO: should be an insert/ from-html-form type thing
// NOTE: it just base64 encodes image and inserts into database
router.post('/insert/photo', upload.single('file'), async (req, res) => {

  // parse file from request and convert to base64
  file = fs.readFileSync(req.file.path)
  file_64 = new Buffer(file).toString('base64')

  // parse out remaining fields
  //TODO use dictionary splat for this from request params/ body
  artistName=req.body.artistName
  trackName=null
  musicXML=null
  key=null
  tempo=null
  image=file

  // insert file into music database
  try {
    entry = await music.insert(artistName, trackName, musicXML, key, tempo, image)
    res.send('sucess')
  } catch (err) {
    res.send('something went wrong!')
  }

})

// delete user
router.get('/remove', async (req, res) => {

  // TODO: convert '' to null to delete entries where the field doesnt exist/ is empty

  try {
    meta = await music.remove(req.query)
    res.send('success')
  } catch (err) {
    res.send('something went wrong')
  }
})

// search database
router.get('/select', async (req, res) => {
  try {
    results = await music.select(req.queryi)
    res.send(results)
  } catch (err) {
    res.status(404).send('something went wrong')
  }
})

// update entry
router.post('/update', async (req, res) => {

  // TODO: figure out way to parse old and new entry data
  old_name = {}
  new_name = {}
  old_name.artistName = req.body.oldName
  new_name.artistName = req.body.newName

  console.log(old_name, new_name)
  try {
    console.log(req.body)
    entry = await music.update(old_name, new_name)
    res.send(entry)
  } catch (err) {
    res.send('something went wrong')
  }
})

module.exports = {
  router: router
}
