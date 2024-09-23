const mongoose = require('mongoose')

const AqJobSchemas = new mongoose.Schema({
    jobowner: {
        type: String,
        require: true
    },
    freelancer: {
        type: String,
        require: true
    },
    jobdescription: {
        type: String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    jobdone:{
        type:Boolean,
        require:true
    },
    amount :{
        type: Number,
        require: true
    }
},
    { timestamps: true }
);

const AqJobs = new mongoose.model('Aqjobs', AqJobSchemas)

module.exports = AqJobs