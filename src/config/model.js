const sequelize = require('sequelize')
const db = require('./database')

const { DataTypes } = sequelize

const Users = db.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    refresh_token: DataTypes.TEXT
},{
    freezeTableName: true
})

module.exports = {Users}
