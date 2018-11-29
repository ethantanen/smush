const grid = require('gridfs-stream')
const mongo = require('mongodb')
const upload = require('multer')({dest:'upload/'})
const path = require('path')
const uuid =

// NOTE: we can limit amount of data by making the midi file a derived element
function make_entry(artist_name, track_name, music_xml, key, tempo, image) {
  return {
    artist_name: artist_name,
    track_name: track_name,
    music_xml: music_xml,
    key: key,
    tempo: tempo,
    image: image,
  }
}

// insert document into database
function insert(artist_name=null, track_name=null, music_xml=null, key=null, tempo=null, image=null) {
  entry = make_entry(artist_name, track_name, music_xml, key, tempo, image)

}

// query database
function select() {
  return
}

// update document in database
function update() {
  return
}

// delete document from
function delete() {
  return 
}

// convert images to base64
function base64Encode(file) {
  return new Buffer(file).toString('base64')
}

// connect to mongo database
const URI = 'mongodb://' + process.env.USERNAME + ':' + process.env.PASSWORD + \
  '@ds115712.mlab.com:15712/music_app_1234'
mongo.MongoClient.connect(URI, async (err, db) => {
  if (err) return console.log(err)
  gfs = grid(db,mongo)
  console.log('connected to db')
})
