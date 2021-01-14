require('dotenv/config')
const http = require('http')
const app = require('./app')
const webhook = require('./util/webhook')

const port = process.env.PORT || 3000

const server = http.createServer(app)

var listener = server.listen(port, function () {
    webhook()
    console.log(`Your app is listening on port ${listener.address().port}`)
})
