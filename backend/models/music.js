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
function insert(artistName=null, trackName=null, musicXML=null, key=null, tempo=null, image=null) {
  return new Promise((resolve, reject) => {
    entry_json = makeEntry(artistName, trackName, musicXML, key, tempo, image)
    entry = new Music(entry_json)
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
      if (entry) return reject(entry)
      return resolve(entry)
    })
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
async function connect() {
  // connect to mongo database
  const URI = 'mongodb://' + process.env.USERNAME + ':' + process.env.PASSWORD +
    '@ds115712.mlab.com:15712/music_app_1234'
  mongoose.connect(URI, {useNewUrlParser: true})

  // define user schema
  userSchema = new mongoose.Schema({
    artistName: String,
    trackName: String,
    musicXML: String,
    key: String,
    tempo: Number,
    image: String
  })

  // create model
  global.Music = mongoose.model('Music', userSchema)
}
