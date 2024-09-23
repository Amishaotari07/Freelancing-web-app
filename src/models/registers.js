const mongoose = require('mongoose')

const userSchemas = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        required: true,
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})

const Register = new mongoose.model('Registers', userSchemas)

module.exports = Register