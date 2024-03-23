const express = require('express')
const cookieParser = require('cookie-parser')

const { router: apiRouter } = require('./api.js')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SALT))

app.use('/', express.static('./public'))

app.use('/api', apiRouter)

const port = process.env.PORT ?? 3000
app.listen(port)
console.log('Listening on port ' + port)
