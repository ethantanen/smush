// router object
const router = require('express')
  .Router()

// render pages view
router.get('/', (req, res) => {
  res.render('user.ejs')
})

module.exports = {
  router: router
}
