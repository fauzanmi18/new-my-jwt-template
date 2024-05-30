const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const db = require('./config/database')
const router = require('./routes')
const port = 9000
const app = express()

dotenv.config()

try {
    db.authenticate({logging: false})
    console.log('database connected')
} catch (error) {
    console.log('failed to connect to database')
    console.log(error)
}

app.use(cors({ credentials: true, origin: true}), cookieParser(), express.json(), router)

app.listen(port, () => {
    console.log('API is running on port', port)
})