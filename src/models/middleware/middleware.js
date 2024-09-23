// is login part ................................(middleware)

const islogin = async(req,res,next)=>{
    try{
        if(req.session.user_id){
            return true
        }else{
           res.redirect('/',{error : 'the session has expired'});
        }
        next()
    }catch(err)
    {
        console.log(err)
    }
}

const islogout = async (req,res)=>{
    try {
        if(req.session.user_id === false){
            // return true
            res.redirect('/')
        }
        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    islogin,
    islogout
}