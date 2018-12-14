// published modules
const router = require('express').Router()
const fs = require('fs')
const ejs = require('ejs')

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

// use nodemailer to send email
router.post('/sendEmail', (req, res) => {
  transporter.sendMail(format(req.body), (err, m) => {
    if (err) return res.render('error.ejs')
    res.render('home.ejs', {message: 'Your email has been sent!', isLoggedIn: req.user})
  })
})

// use nodemailer to send a request admin email to the smush account
router.get('/request-admin', async (req, res) => {

  message = await fs.readFileSync('./views/admin-auth/admin-email.ejs').toString()
  message = ejs.render(message, {user: req.user, url: process.env.SITE_URL})

  mailOptions = {
    from: 'guccipancakes1234@gmail.com',
    to: 'guccipancakes1234@gmail.com',
    subject: 'Email From Smush Request Admin Page',
    html: message
  }

  transporter.sendMail(mailOptions, (err, m) => {
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
