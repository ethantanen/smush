const music = require('../models/music')

// router object
const router = require('express')
  .Router()

// render pages view
router.get('/', (req, res) => {
  res.render('admin.ejs')
})

// insert score
router.post('/insert', (req, res) => {
  
})

module.exports = {
  router: router
}
