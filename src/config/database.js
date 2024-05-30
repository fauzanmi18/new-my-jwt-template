const sequelize = require('sequelize')

const db = new sequelize({
    database: 'hexa_comp',
    username: 'root',
    password: '',
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})

module.exports = db