// TODO: check for redundency before inserting a document
var mongoose = require('mongoose');

// NOTE: we can limit amount of data by making the midi file a derived element
// return json representation of music database entry
function makeEntry(artistName, trackName, musicXML, key, tempo, image) {
  return {
    artistName: artistName,
    trackName: trackName,
    musicXML: musicXML,
    key: key,
    tempo: tempo,
    image: image,
  }
}

// insert document into database
function insert(entry) {
  return new Promise((resolve, reject) => {
    // entry_json = makeEntry(artistName, trackName, musicXML, key, tempo, image)
    entry = new Music(entry)
    entry.save().then((entry) => {
      if(!entry) return reject('couldn\'t add user')
      return resolve(entry)
    })
  })
}

// select document from database, returns a promise-like object (good for async, await)
// TODO: maybe create specific functions for more
// complex queries
function select(query) {
  return new Promise((resolve, reject) => {
    Music.find(query).then((entry) => {//.limit.sort ... very open ended!
      if (!entry) return reject(entry)
      return resolve(entry)
    })
  })
}

// search database with mongodb text field
function search(query) {
  return new Promise((resolve, reject) => {
    //TODO: add search w/ text qualifier 
  })
}


// update document in database
function update(query, update) {
  return new Promise((resolve, reject) => {
    Music.findOneAndUpdate(query, update).then((entry) => {
      if (!entry) return reject('user doesnt exist')
      return resolve(entry)
    })
  })
}

// delete document from database
function remove(query) {
  return new Promise((resolve, reject) => {
    Music.find(query).deleteOne().then((meta) => {
      if (!meta) return reject('entry doesn\'t exist')
      return resolve(meta) //TODO: what does remove return?
    })
  })
}

// connect to database
function connect() {
  // connect to mongo database
  const URI = 'mongodb://' + process.env.USERNAME_MLAB + ':' + process.env.PASSWORD_MLAB +
    '@ds115712.mlab.com:15712/music_app_1234'
  mongoose.connect(URI, {useNewUrlParser: true})

  // define music schema
  musicSchema = new mongoose.Schema({
    artistName: String,
    trackName: String,
    musicXML: String,
    key: String,
    tempo: String,
    image: String
  })

  // create model
  global.Music = mongoose.model('Music', musicSchema)
}

// make functions visible to other modules
module.exports = {
  connect: connect,
  insert: insert,
  remove: remove,
  update: update,
  select: select,
}
