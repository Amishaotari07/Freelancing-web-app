const mongoose = require('mongoose')
const conn2 = require('../db/conn')

const jobSchemas = new mongoose.Schema({
    username:{
        required:true,
        type:String
    },
    genere: {
        require: true,
        type: String
    },
    description: {
        type: String,
        require: true
    },
    all:{
        type:Number,
        require:true
    }
})

const Job = conn2.jobs.model('jobs', jobSchemas)

module.exports = Job