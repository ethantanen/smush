// NOTE: need to do some research on passport
// for authentication and such
// TODO: check for reduncy before inserting a document!

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// return json representation of user
function makeUser(username=null, password=null, email=null, name=null, permissions=null) {
  return {
    username: username,
    password: password,
    email: email,
    name: name,
    permissions: permissions,
  }
}

// insert document into database
async function insert(entry) {
  return new Promise( async (resolve, reject) => {
    console.log('[ENTRY]', entry)
    // check if user exists already before inserting new user
    isUser = await User.findOne(entry)
    if (isUser) return reject('username or email already exists')

    if(entry.password) entry.password = await makePasswordHash(entry.password)

    user = new User(entry)
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
    User.findOne(query).then((users) => {//.limit.sort ... very open ended!
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

function makePasswordHash(password) {
  return bcrypt.hash(password, 12)
}

function validatePasswordHash(password, storedPasswordHash) {
  console.log('dfjas;ldfja;lskdjfalk;sdjf;alksdjf;asj')
  return bcrypt.compare(password, storedPasswordHash)
}

// connect to database
function connect() {
  // connect to mongo database
  const URI = 'mongodb://' + process.env.USERNAME_MLAB + ':' + process.env.PASSWORD_MLAB +
    '@ds115712.mlab.com:15712/music_app_1234'
  mongoose.connect(URI, {useNewUrlParser: true})

  // define user schema
  userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: String,
    facebookId: String,
    twitterId: String,
    permissions: String,
  })

  // create model
  global.User = mongoose.model('Users', userSchema)

}

// make functions visible to other modules
module.exports = {
  connect: connect,
  insert: insert,
  remove: remove,
  update: update,
  select: select,
  validatePasswordHash: validatePasswordHash,
}
