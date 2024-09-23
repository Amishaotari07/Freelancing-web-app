const mongoose = require('mongoose')

const PostSchemas = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:false
    },
    post:{
        type:String,
        require:true
    },
    desc:{
        type:String,
    },
})

const Posts = new mongoose.model('posts', PostSchemas)

module.exports = Posts