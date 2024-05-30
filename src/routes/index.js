const express = require('express')
const { register } = require('../controller/user')
const { refreshToken, login, logout } = require('../controller/auth')
const { verifyToken } = require('../middleware/index')
const router = express.Router()

router.route('/').get((req, res) => {
    res.json('API is ready...')
})

router.route('/add-user')
    .post(register)

router.route('/login')
    .post(login)

router.route('/logout')
    .delete(logout)

router.route('/token')
    .post(refreshToken)
    
module.exports = router