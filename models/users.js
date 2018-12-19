// published modules
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// insert document into database
async function insert(entry) {
  return new Promise( async (resolve, reject) => {

    // check if user exists already before inserting new user
    isUser = await User.findOne({username: entry.username, email: entry.email})
    if (isUser) return reject('username or email already exists')
    if(entry.password) entry.password = await makePasswordHash(entry.password)
    entry.permissions = 'User'

    user = new User(entry)
    user.save().then((user) => {
      if(!user) return reject('couldn\'t add user')
      return resolve(user)
    })
  })
}

// select document from database, returns a promise-like object (good for async, await)
function select(query) {
  return new Promise((resolve, reject) => {
    User.findOne(query).then((users) => {//.limit.sort ... very open ended!
      if (!users) return reject('couldn\'t select user')
      return resolve(users)
    })
  })
}

// update document in database
function update(id, update) {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, update, { new: true }).then((user) => {
      if (!user) return reject('couldn\'t update user')
      return resolve(user)
    })
  })
}

// delete document from database
function remove(id) {
  return new Promise((resolve, reject) => {
    User.findByIdAndDelete(id).then((meta) => {
      if (!meta) return reject(meta)
      return resolve(meta) //TODO: what does remove return?
    })
  })
}

// encrypt password using salt cryptography
function makePasswordHash(password) {
  return bcrypt.hash(password, 12)
}

// check if hash matches plain text password
function validatePasswordHash(password, storedPasswordHash) {
  return bcrypt.compare(password, storedPasswordHash)
}

// connect to database
function connect() {

  // connect to mongo database
  const URI = process.env.MONGO_URI
  options = { server: { socketOptions: { keepAlive: 1 } }, useNewUrlParser: true}
  mongoose.connect(URI, options)
    .catch((err) => {console.log(JSON.stringify(err, null, 2))})

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
  makePasswordHash: makePasswordHash,
}
