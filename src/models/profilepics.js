const mongoose = require('mongoose')

const PicSchemas = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    ProfilePic:{
        type:String,
        require:true
    }
})

const Profilepics = new mongoose.model('profilepics', PicSchemas)

module.exports = Profilepics