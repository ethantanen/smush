
/*
  middleware to check if a user has the correct permissions
*/

// check if user has the correct permissions
function _checkAuth(req, res, next, permission) {

  // error message
  login = 'You must be logged in to visit that page!'
  permissions = 'You need ' + permission + ' permissions if you want to visit that page!'

  // render error message if user is not logged in
  if (!req.user) {
    return res.render('login.ejs', {isLoggedIn: false, message: login})
  }
  // render error message if user does not have correct permissions
  if (!permission.includes(req.user.permissions)) {
    return res.render('home.ejs', {isLoggedIn: req.user, message: permissions})
  }

  // continue to endpoint if everything checks out!
  next()
}

// admin wrapper for the _checkAuth function
function isAdmin(req, res, next) {
  _checkAuth(req, res, next, ['Admin'])
}

// user wrapper for the _checkAuth function
function isUser(req, res, next) {
  console.log('HERE')
  _checkAuth(req, res, next, ['User', 'Admin'])
}

module.exports = {
  isAdmin: isAdmin,
  isUser: isUser,
}
