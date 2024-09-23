const mongoose = require('mongoose')

const MessageSchemas = new mongoose.Schema({
    sender: {
        type: String,
        require: true
    },
    receiver: {
        type: String,
        require: true
    },
    jobdescription: {
        type: String,
    },
    mydesc:{
        type:String,
    },
    amount :{
        type: Number,
        require: true
    }
},
    { timestamps: true }
);

const Bids = new mongoose.model('Bids', MessageSchemas)

module.exports = Bids