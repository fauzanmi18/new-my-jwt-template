const bcrypt = require('bcrypt')
const {Users} = require('../config/model')
const responses = require('../response')

const register = async(req, res) => {
    console.log(req.body)
    const { name, email, username, password } = req.body
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)

    if(!name&&!email&&!username&&!password) return responses(403, {status: 'Error', message: 'Please fill the credentials'}, res)
    if(!name) return responses(403, {status: 'Error', message: 'Name is required'}, res)
    if(!email) return responses(403, {status: 'Error', message: 'Email is required'}, res)
    if(!username) return responses(403, {status: 'Error', message: 'Username is required'}, res)
    if(!password) return responses(403, {status: 'Error', message: 'Password is required'}, res)

    console.log(`email ${email} - password ${password}`)
    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
        Users.findOne({ where: { email } }),
        Users.findOne({ where: { username } }),
      ])
  
      if (existingUserByEmail) {
        return responses(409, { status: 'Error', message: 'Email sudah digunakan' }, res)
      }
  
      if (existingUserByUsername) {
        return responses(409, { status: 'Error', message: 'Username sudah digunakan' }, res)
      }

    try {
        const insert = await Users.create({
            name: name,
            email: email,
            username: username,
            password: hash
        })

        const response = {
            status_code: 201,
            message: "Success create data",
        }

        responses(201, response, res)
    } catch (error) {
        console.log('Error when creating a new data')
        const response = {
            status_code: 500,
            message: "Error when processing register"
        }
        responses(201, response, res)
        // console.log(error)
    }
}

module.exports = { register }