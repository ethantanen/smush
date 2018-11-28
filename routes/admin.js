// router object
const router = require('express')
  .Router()

// render pages view
router.get('/', (req, res) => {
  res.render('admin.ejs')
})

module.exports = {
  router: router
}
