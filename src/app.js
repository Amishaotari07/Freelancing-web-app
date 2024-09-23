const express = require("express");
const hbs = require("hbs");
const multer = require('multer')
const path = require("path");
const session = require("express-session")
const app = express();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
// const Handlebars = require('handlebars')
// const val = require('../public/script/chatclient')
// const hbs = require('handlebars');
// const server = require('http').createServer(app)


const Handlebars = require('handlebars');

Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log(file.originalname)
        console.log(file)
        cb(null, Date.now() + file.originalname)
    }
});

const upload = multer({ storage: storage })

let uniuserdata;
let content;
let uniContactedUser;



const port = process.env.port || 8000;
const hostname = 'localhost';

require('../src/db/conn.js')

const Register = require('./models/registers')
const Job = require('./models/jobs')
const Bids = require('./models/bids')
const ProfilePics = require('./models/profilepics')
const Posts = require('./models/posts')
const AqJobs = require('./models/aquiredjob')

const template_path = path.join(__dirname, "../public/template");
const public_path = path.join(__dirname, "../public");
const partials_path = path.join(__dirname, "../public/partials");
const config = require('./config/config.js')
const middleware = require('./models/middleware/middleware');
// const Posts = require("./models/posts");
// const { io } = require("socket.io-client");


app.use(express.static(path.join(__dirname, './images')));

app.use(express.static(public_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

// app.get('/try',(req,res)=>{
//     res.render("try")
// })

app.get("/", (req, res) => {
    // content = null
    res.render("index", { error: content });

})

app.get('/profile2/:username', async (req, res) => {
    if (req.session.user_id) {
        const username = req.params.username
        const userdata = await Register.findOne({ username: username })
        const feed = await Posts.find({ username: userdata?.username })
        res.render('profile2', { userData: userdata, Feed: feed })
    }
})

app.get("/myjobs/:username", async (req, res) => {
    if (req.session.user_id) {
        const username = req.params.username
        // console.log(username)
        const biddata = await Bids.find({ receiver: username })
        const userdata = await Register.find({ username: username })
        console.log(biddata)
        console.log(userdata)
        // res.send(biddata)
        res.render("myjobs", { userdata: userdata, biddata: biddata })
    }
})

app.get("/givenjobs/:username", async (req, res) => {
    if (req.session.user_id) {
        const myjobs = await AqJobs.find({ jobowner: req.params.username })
        res.render('givenjobs', { Ajobs: myjobs })
    }
})

app.get('/aquiredjobs/:username', async (req, res) => {
    if (req.session.user_id) {
        const username = req.params.username
        // console.log(req.session.user_email)
        const userdata = await Register.find({ username: username })
        const aqjobs = await AqJobs.find({ freelancer: username })
        console.log(userdata)
        res.render('aquiredjobs', { userData: userdata, Ajobs: aqjobs })
    }
})

app.get('/post/:username', async (req, res) => {
    if (req.session.user_id) {
        const username = req.params.username
        const userdata = await Register.findOne({ usrname: username })
        res.render('post', { userData: userdata })
    } else {
        res.send("login first")
    }
})
app.get('/logout', (req, res, next) => {
    // logout.temp
    try {
        req.session.destroy()
        // res.render('index',{error:'logged out sucessfully'})
        middleware.islogout()
        content = 'logged out successfully'
        res.redirect('/')

    } catch (error) {
        console.log(error)
    }
})

app.get("/services", (req, res) => {
    uniuserdata = undefined
    uniemail = undefined
    res.render('services');
})

app.get("/bid/:description1", async (req, res) => {
    // res.send('bid')
    if (req.session.user_id) {
        const desc = req.params.description1;
        const userdata = await Register.findOne({ username: uniuserdata.username })
        const jobdata = await Job.findOne({ description: desc })
        res.render('bid', { jobreq: jobdata, userData: userdata, content: content })
    } else {
        res.send('login first')
    }
})

app.get("/profile/:username", async (req, res) => {
    if (req.session.user_id) {
        const username = req.params.username
        try {

            const userdata = await Register.findOne({ username: username })
            const feed = await Posts.find({ username: userdata?.username })
            res.render('profile', { userData: userdata, Feed: feed })
        }
        catch (e) {
            console.log(e)
        }
        // console.log(feed)
        // console.log(userdata._id)
    } else (
        res.send('login first')
    )
})

app.get("/contact", (req, res) => {
    uniuserdata = undefined
    uniemail = undefined
    res.render('contact');
})
app.get("/about", (req, res) => {
    uniemail = undefined
    uniuserdata = undefined
    res.render('about');
})

app.get('/forgotpassword', async (req, res) => {
    res.render('forgotpassword')
})
app.get("/signup", (req, res) => {
    uniemail = undefined
    uniuserdata = undefined
    res.render('signup');
})
app.get('/createjob/:username', async (req, res) => {
    if (req.session.user_id) {
        const username = req.params.username
        const userdata = await Register.findOne({ username: username })
        console.log(userdata)
        res.render('createjob', { userData: userdata, jobdone: content })
        // content = null
    } else {
        res.send('page not found')
    }
})


app.get("/*", (req, res) => {

    res.status(400).send("Page Not Found");
})

app.post('/signup', async (req, res) => {
    try {
        // if(body.req.username ==null || body.req.name == null || body.req.surname ==null || body.req.email == null || body.req.password == null || body.req.confirmpassword == null){
        //     res.send("fill full form")
        // }
        // else{
        const userdata = await Register.findOne({ username: req.body.username })
        const userdata2 = await Register.findOne({email: req.body.email})
        if (userdata == undefined && userdata2 ==undefined) {
            const password = req.body.password
            const hashedpassword = await bcrypt.hash(password, 10)
            const confirmpassword = req.body.confirmpassword

            if (password === confirmpassword) {
                const registerusr = Register({
                    name: req.body.name,
                    surname: req.body.surname,
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedpassword,
                })
                const request = await registerusr.save();
                res.render("index")
            } else {
                res.send('not matched')
            }
        }else{
            res.send("the email or username already exists")
        }

        // }
    } catch (error) {
        res.send(error)
    }
}
)


app.post("/login", async (req, res) => {
    try {
        const user_email = req.body.email;
        const user_password = req.body.password;
        try {
            const userdata = await Register.findOne({ email: user_email })
            if (userdata != null) {
                uniuserdata = userdata
                if (user_email == userdata.email) {
                    const passvalid = await bcrypt.compare(user_password, userdata.password)
                    if (passvalid) {
                        req.session.user_id = userdata._id
                        let content1 = userdata
                        const jobreq = await Job.find({ all: 1 })
                        // res.send(jobreq)
                        let len = jobreq.length
                        let dataTags = [];
                        // console.log(len)
                        // for(let i =0;i< len;i++){
                        //     dataTags.push(jobreq[i])
                        // }
                        res.render('login', { userData: content1, jobreq: jobreq })
                        content = null
                    }
                    else {
                        content = 'password incorrect'
                        res.redirect('/')
                        req.session.destroy();
                    }
                } else {
                    content = "incorrect email"
                    res.redirect('/')
                }
            } else {
                content = 'the email does not exist'
                res.redirect('/')
            }
        }
        catch (err) {
            console.log(err)
            content = null
            res.redirect('/')
        }
    } catch (error) {
        console.log('there is an error in the site', error)
    }
})

app.post('/forgotpassword1', async (req, res) => {
    const username = req.body.username
    const userdata = await Register.findOne({ username: username })
    if (userdata.email == req.body.email) {
        const nodemailer = require('nodemailer');

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_username',
                pass: 'your_email_password'
            }
        });

        // generate a random password
        const tempPassword = Math.random().toString(36).slice(-8); // generates an 8 character alphanumeric password

        // setup email data with temp password
        const mailOptions = {
            from: 'your_email',
            to: body.req.email,//there email
            subject: 'Password Changed',
            text: `Your temporary password is: ${tempPassword}`
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                // const aqjob = await AqJobs.updateOne({ id: req.params.id, jobdone: true })
                const hashedpassword = await bcrypt.hash(tempPassword, 10)
                const data = await Register.updateOne({ username: userdata.username, password: hashedpassword })

            }
        });
        res.redirect('/home')
    }
})

// job request code...................................................................

app.post(`/createjob/:username`, async (req, res) => {
    try {
        // console.log(req.body.genere)
        // console.log(req.body.description)
        const username = req.params.username;
        console.log('username', username)
        // const userdata = await Register.findOne({ username: username })
        if (req.session.user_id) {
            const jobs = Job({
                username: username,
                genere: req.body.genere,
                description: req.body.description,
                all: 1
            })
            const request = await jobs.save();
            // res.send('data uploaded');
            content = 'data uploaded'

            // alert("data uploaded");
            res.redirect('/createjob')
        } else {
            req.status(400).send('page not found')
        }
    } catch (error) {
        // req.status(400).send('page not found')
        console.log(error)
    }
})

// bid posting

app.post("/bid/:user/:thisuser/:description", async (req, res) => {
    const thatuser = req.params.user
    const thisuser = req.params.thisuser
    const jobdesc = req.params.description
    // console.log(jobdesc)

    const bids = Bids({
        sender: thisuser,
        receiver: thatuser,
        mydesc: req.body.description,
        jobdescription: jobdesc,
        amount: req.body.amount
    })

    const request = await bids.save();
    // res.send('data uploaded');
    content = 'data uploaded'
    // alert("data uploaded");n
    res.redirect(`/bid/${thisuser}`)
})

//post code.........................................................................

app.post("/post/:username/", upload.single("image"), async (req, res) => {
    const username = req.params.username
    const desc = req.body.desc

    const userdata = await Register.findOne({ username: uniuserdata.username })
    const posts = Posts({
        username: userdata.username,
        post: req.file.filename,
        desc: desc
    })
    const request = await posts.save();
    // console.log(req.file)
    // console.log(uniuserdata.username)
    res.redirect(`/profile/${uniuserdata.username}`)
})

// aquired job code...................................................................

app.post("/givejob/:receiver/:sender/:mydesc", async (req, res) => {
    const sender = req.params.sender
    const receiver = req.params.receiver
    const mydesc = req.params.mydesc
    const userdata = await Register.findOne({ username: receiver })
    const biddata = await Bids.findOne({ sender: sender, receiver: receiver, mydesc: mydesc })
    // console.log(biddata)
    const aqjobs = AqJobs({
        jobowner: receiver,
        freelancer: sender,
        jobdescription: biddata.jobdescription,
        email: userdata.email,
        jobdone: false,
        amount: biddata.amount
    })
    const request = await aqjobs.save();
    res.redirect(`/profile/${receiver}`)
})

app.post('/jobdone/:id/:freelancer', async (req, res) => {
    const userdata = await Register.findOne({ username: req.params.freelancer })
    const aqjob = await AqJobs.updateOne({ id: req.params.id, jobdone: true })
    res.redirect(`/aquiredjobs/${userdata.username}`)
})

app.post('/cancel/:id/:freelancer', async (req, res) => {
    const userdata = await Register.findOne({ username: req.params.freelancer })
    const del = await AqJobs.deleteOne({ id: req.params.id })
    console.log(userdata)
    res.redirect(`/aquiredjobs/${userdata.username}`)
})

app.post('/deletejob/:description/:username', async (req, res) => {
    const username = req.params.username
    const del = await Job.deleteOne({ description: req.params.description })
    res.redirect(`/myjobs/${username}`)
})

app.listen(port, hostname, () => {
    console.log(`Server On : ${hostname}:${port}`);
})