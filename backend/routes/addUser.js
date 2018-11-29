// router object
const router = require('express')
  .Router()

// render pages view
router.post('/', (req, res) => {
  res.render('addUser.ejs')
})

module.exports = {
  router: router
}
