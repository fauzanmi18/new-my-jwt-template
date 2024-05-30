const { Users } = require("../config/model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const responses = require('../response')
const { Op } = require("sequelize")

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' })
}

const refreshToken = async(req, res) => {
    const refreshToken = req.cookies.token
    if (refreshToken == null) return responses(401, {status_code: 401, message: 'No content'}, res)
    
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    })

    if(!user[0]) return responses(403, {status_code: 403, message: 'Token unmatch'}, res)
    
    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        return responses(403, {status_code: 403, message: 'Invalid token request'}, res)
    }
    
    const { id: userId, username, name, email } = user[0]
    const accessToken = generateAccessToken({userId, username, name, email})

    responses(201, {
        status_code: 201, 
        message: 'Access Token sudah di refresh', 
        accessToken
    }, res)
}

const login = async(req, res) => {
    if (
        (!req.body.username && !req.body.email) || 
        !req.body.password || 
        (req.body.username && req.body.username.trim() === '') || 
        (req.body.email && req.body.email.trim() === '') || 
        req.body.password.trim() === ''
    ) {
        return responses(403, { status_code: 403, message: 'Silahkan isi username atau email dan password' }, res)
    }
    
    try {
        const user = await Users.findAll({
            where: {
              [Op.or]: [{ email: req.body.username }, { username: req.body.username }],
            },
          })

        if (!user) {
            return responses(404, { status_code: 404, message: 'Username atau Email tidak ditemukan' }, res)
        }

        const cekPassword = await bcrypt.compare(req.body.password, user[0].password)
        if(!cekPassword) return responses(404, {status_code: 404, message: 'Password Salah'}, res)
        
        const { id: userId, username, name, email } = user[0]

        const accessToken = generateAccessToken({userId, username, name, email})
        // const accessToken = jwt.sign({userId, username, name, email}, process.env.ACCESS_TOKEN_SECRET, {
        //     expiresIn: '60s'
        // })
        const refreshToken = jwt.sign({userId, username, name, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })

        await Users.update({refresh_token: refreshToken},{
            where: {
                id: userId
            }
        })

        res.cookie('token', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // sameSite: 'None',
            // secure:true
        })

        responses(200, {
            status_code: 200,
            message: 'Login berhasil',
            userData: {name, username},
            accessToken,
            refreshToken
        }, res)
    } catch (error) {
        responses(404, {
            status_code: 404,
            message: 'Username atau Email tidak ditemukan'
        }, res)
    }
}

const logout = async(req, res) => {
    const refreshedToken = req.cookies.token
    if(!refreshedToken) return responses(204,{status_code: 204, message: 'No Content'}, res)

    const user = await Users.findAll({
        where: {
            refresh_token: refreshedToken
        }
    })

    if(!user[0]) return responses(204,{status_code: 204, message: 'No Content'}, res)
    
    const userId = user[0].id
    await Users.update({refresh_token: null},{
        where: {
            id: userId
        }
    })

    res.clearCookie('token')
    return responses(200,{status_code: 200, message: 'Logout berhasil'}, res)
}

module.exports = {refreshToken, login, logout}