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
  send(req, res, {user: req.body}, './views/contact_email.ejs', 'Your email has been sent!', 'home.ejs')
})

// use nodemailer to send a request admin email to the smush account
router.get('/request-admin', async (req, res) => {
  send(req, res, {user: req.user, url: process.env.SITE_URL + '/user/admin-confirm?user='},
    './views/admin-auth/admin-email.ejs', 'Admin Permission Request Sent!', 'profile.ejs')
})

// // use nodemailer to send a reset password link to a user
// router.get('/reset-password', async (req, res) => {
//
//   // make sure user has an email
//   if (!req.user.email) {
//     res.render('login.ejs', {isLoggedIn: req.user, message: 'You don\'t have an email associated with your account and thusly we cant confirm your identity nor reset your password! You can always make a new account'})
//   }
//
//   send(req, res, {user: req.user, url: process.env.SITEURL + '/user/r='})
// })

async function send(req, res, info, path_to_template, confirmation_msg, confirmation_view) {

  // render/format emails template
  message = await fs.readFileSync(path_to_template).toString()
  message = ejs.render(message, info)

  // configure nodemailer options
  mailOptions = {
    from: 'guccipancakes1234@gmail.com',
    to: 'guccipancakes1234@gmail.com',
    subject: 'Email From Smush!',
    html: message
  }

  // send email
  transporter.sendMail(mailOptions, (err, m) => {
    if (err) res.render('error.ejs');
    res.render(confirmation_view, {message: confirmation_msg, isLoggedIn: req.user, user: req.user})
  })
}

module.exports = {
  router: router
}
