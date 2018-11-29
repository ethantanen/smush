
// NOTE: need to do some research on passport for authentication and such

const grid = require('gridfs-stream')
const mongo = require('mongodb')
const upload = require('multer')({dest:'upload/'})
const path = require('path')

// NOTE: we can limit amount of data by making the midi file a derived element
function make_entry(username) {
  return {
    username: username
  }
}

// insert document into database
function insert(username=null) {
  entry = make_entry(username)
}

// select document from database
function select() {
  return
}

// update document in database
function update() {
  return
}

// delete document from database 
function delete() {
  return
}

// connect to mongo database
const URI = 'mongodb://' + process.env.USERNAME + ':' + process.env.PASSWORD + \
  'add name of database woo!'
mongo.MongoClient.connect(URI, async (err, db) => {
  if (err) return console.log(err)
  gfs = grid(db,mongo)
  console.log('connected to db')
})
