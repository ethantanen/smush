// published modules
const router = require('express').Router()

// create transporter object used to send emails
const transporter = require('nodemailer').createTransport({
 service: 'gmail',
 auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASSWORD_EMAIL
    }
})

// render contact view
router.get('/', (req, res) => {
  res.render('contact.ejs', {isLoggedIn: req.user, message:""})
})

// use nodemailer to send the email
router.post('/sendEmail', (req, res) => {
  transporter.sendMail(format(req.body), (err, m) => {
    if (err) return res.render('error.ejs')
    res.render('home.ejs', {message: 'Your email has been sent!', isLoggedIn: use})
  })
})

router.get('/request-admin', (req, res) => {
  req.body.message = 'Request Admin Permission <br>' +
  '<form action="http://localhost:3000/user/update" method="POST">' +
  'ID: <input type="text" name="_id" value="' + req.user._id + '" readonly>' +
  'Permissions: <input type="text" name="permissions" value="Admin" readonly>' +
  '<input type="submit">' +
  '</form>'

  console.log('req.body', req.body)
  transporter.sendMail(format(req.body), (err, m) => {
    if (err) console.log(err);
    res.render('profile.ejs', {message: 'Admin. Permissions request sent!', isLoggedIn: req.user, user: req.user})
  })

})

// format the email
function format(info) {
  message = 'name: ' + info.name + '<br>' +
          '\nemail: ' + info.email + '<br>' +
          '\nmessage: ' + info.message
  mailOptions = {
    from: 'guccipancakes1234@gmail.com',
    to: 'guccipancakes1234@gmail.com',
    subject: 'Email From Smush Contact Page',
    html: message
  }
  return mailOptions
}
module.exports = {
  router: router
}
