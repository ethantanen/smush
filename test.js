const express = require('express')
app = express()
app.listen(3500)

test = (req, res, next, v) => {
	console.log(v)
	next()
}

//app.use(test)

app.get('/', (req, res, next) => {test(req,res,next,'sup')}, (req, res) => {
	res.send('hello')
})


