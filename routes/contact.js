// published modules
const router = require('express').Router()
const fs = require('fs')
const ejs = require('ejs')

// import model
const users = require('../models/users')

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
  send(req, res, {user: req.body}, './views/contact_email.ejs', 'Your email has been sent!', 'home.ejs', 'guccipancakes1234@gmail.com')
})

// use nodemailer to send a request admin email to the smush account
router.get('/request-admin', async (req, res) => {
  send(req, res, {user: req.user, url: process.env.SITE_URL + '/user/admin-confirm?user='},
    './views/admin-auth/admin-email.ejs', 'Admin Permission Request Sent!', 'profile.ejs', 'guccipancakes1234@gmail.com')
})

// use nodemailer to send a reset password link to a user
router.post('/reset-password', async (req, res) => {

  user = await users.select(req.body)

  if (!user.email) {
    return res.render('password-reset/password-reset-email.ejs', {isLoggedIn: req.user, message: 'You don\'nt have an email associated with your account and thusly we cannot send you a reset password form. Maybe make a new account?'})
  }

  send(req, res, {user: user, url: process.env.SITE_URL + '/user/reset-password-form?user='}, './views/password-reset/password-reset-email.ejs',
    'Password reset sent to your email. Check your email and click on the link.', 'home.ejs', user.email)

})

async function send(req, res, info, path_to_template, confirmation_msg, confirmation_view, to) {

  // render/format emails template
  message = await fs.readFileSync(path_to_template).toString()
  message = ejs.render(message, info)

  // configure nodemailer options
  mailOptions = {
    from: 'guccipancakes1234@gmail.com',
    to: to,
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
