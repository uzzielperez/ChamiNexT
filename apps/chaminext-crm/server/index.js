const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')

const app = express()
app.use(bodyParser.json())

app.use('/api', routes)

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`ChamiNext CRM API running on http://localhost:${port}`))
