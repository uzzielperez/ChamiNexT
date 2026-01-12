const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api')

const app = express()
app.use(bodyParser.json())

app.post('/api/generate', api.generate)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
