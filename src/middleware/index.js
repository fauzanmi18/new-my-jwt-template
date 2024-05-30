const responses = require('../response')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token || token == null || token == '') return responses(401, 
        {status_code: 401, message: 'No content'}, 
        res
    )

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next()
    } catch (error) {
        return responses(403, 
            {status_code: 403, message: 'Forbidden', error}, 
            res
        )
    }
}

module.exports = { verifyToken }

