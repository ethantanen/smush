var mongoose = require('mongoose');

// insert document into database
function insert(entry) {
  return new Promise((resolve, reject) => {
    entry = new Music(entry)
    entry.save().then((entry) => {
      if(!entry) return reject('couldn\'t add user')
      return resolve(entry)
    })
  })
}

// select document from database, returns a promise-like object (good for async, await)
function select(query) {
  return new Promise((resolve, reject) => {
    Music.find(query).collation({ locale: "en", strength: 2}).sort({'artistName':1, 'trackName': 1}).then((entry) => {//.limit.sort ... very open ended!
      if (!entry) return reject(entry)
      return resolve(entry)
    })
  })
}

// search database with mongodb text field
function search(query) {
  return new Promise((resolve, reject) => {
    Music.find({$text: {$search: query }})
      .sort({'artistName':1, 'trackName': 1})
      .then(resolve)
      .catch(reject)
  })
}

// update document in database
function update(id, update) {
  return new Promise((resolve, reject) => {
    Music.findByIdAndUpdate(id, update, {new: true}).then((entry) => {
      if (!entry) return reject('entry doesn\'t exist')
      return resolve(entry)
    })
  })
}

// delete document from database
function remove(id) {
  return new Promise((resolve, reject) => {
    Music.findByIdAndDelete(id).then((meta) => {
      if (!meta) return reject('entry doesn\'t exist')
      return resolve(meta) //TODO: what does remove return?
    })
  })
}

// connect to database
async function connect() {

  // connect to mongo database
  const URI = process.env.MONGO_URI
  options = { server: { socketOptions: { keepAlive: 1 } }, useNewUrlParser: true };
  mongoose.connect(URI, options)

  // define music schema
  musicSchema = new mongoose.Schema({
    artistName: String,
    trackName: String,
    musicXML: String,
    key: String,
    tempo: String,
    image: String,
    midi: String,
  })

  // setup indices for full text search
  musicSchema.index({artistName: 'text', trackName: 'text', key: 'text', tempo: 'text'}, {collation: {locale: 'en', strength: 2}})

  // create model
  global.Music =  mongoose.model('Music', musicSchema)
}

// make functions visible to other modules
module.exports = {
  connect: connect,
  insert: insert,
  remove: remove,
  update: update,
  select: select,
  search: search,
}
