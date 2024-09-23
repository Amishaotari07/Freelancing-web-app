const mongoose = require('mongoose')

mongoose.set('strictQuery',true)
mongoose.connect("mongodb://127.0.0.1:27017/userdata",{
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true
},(err)=>{
    if(err){
        console.log(`connection not successful: ${err}`)
    }
    else{
        console.log('connection successful')
    }
})


// jobs database connection............
mongoose.set('strictQuery',true)
mongoose.jobs = mongoose.createConnection("mongodb://127.0.0.1:27017/jobs",{
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true
},(err)=>{
    if(err){
        console.log(`connection 2 not successful: ${err}`)
    }
    else{
        console.log('connection 2 successful')
    }
})


mongoose.set('strictQuery',true)
mongoose.bids = mongoose.createConnection("mongodb://127.0.0.1:27017/bids",{
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true
},(err)=>{
    if(err){
        console.log(`connection 3 not successful: ${err}`)
    }
    else{
        console.log('connection 3 successful')
    }
})

mongoose.set('strictQuery',true)
mongoose.profilepic = mongoose.createConnection("mongodb://127.0.0.1:27017/prfilepics",{
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true
},(err)=>{
    if(err){
        console.log(`connection 4 not successful: ${err}`)
    }
    else{
        console.log('connection 4 successful')
    }
})

mongoose.set('strictQuery',true)
mongoose.posts = mongoose.createConnection("mongodb://127.0.0.1:27017/posts",{
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true
},(err)=>{
    if(err){
        console.log(`connection 5 not successful: ${err}`)
    }
    else{
        console.log('connection 5 successful')
    }
})


module.exports = mongoose;
