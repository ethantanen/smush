// NOTE: need to do some research on passport
// for authentication and such
// TODO: check for reduncy before inserting a document

var mongoose = require('mongoose');

// return json representation of user
function makeUser(username=null) {
  return {
    username: username,
  }
}

// insert document into database
function insert(username=null) {
  return new Promise((resolve, reject) => {
    user_json = makeUser(username)
    user = new User(user_json)
    user.save().then((user) => {
      if(!user) return reject('couldn\'t add user')
      return resolve(user)
    })
  })
}

// select document from database, returns a promise-like object (good for async, await)
// TODO: maybe create specific functions for more
// complex queries
function select(query) {
  return new Promise((resolve, reject) => {
    User.find(query).then((users) => {//.limit.sort ... very open ended!
      if (!users) return reject('couldn\'t select user')
      return resolve(users)
    })
  })
}

// update document in database
function update(query, update) {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate(query, update).then((user) => {
      if (!user) return reject('couldn\'t update user')
      return resolve(user)
    })
  })
}

// delete document from database
function remove(query) {
  return new Promise((resolve, reject) => {
    User.find(query).deleteOne().then((meta) => {
      if (!meta) return reject('couldn\'t remove user')
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
    username: String
  })

  // create model
  global.User = mongoose.model('Users', userSchema)

  //TODO: this is the place to attatch functions to the model
  remove({'username': 'adfaj;'})
    .then(console.log)
    .catch(console.log)
}
