const express = require('express');
const app = express();
app.listen(3000);
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser())
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')
const { db } = require('./models/userModel');
const userModel = require('../Backend/models/userModel');
const venderModel = require('../Backend/models/venderModel');
const customerModel = require('../Backend/models/customerModel');
const {sendMail} = require('../Backend/utility/nodemailer')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken');
const JWT_KEY = require('../secrets')

const userRouter = require('../Backend/Routers/userRouter')
const authRouter = require('../Backend/Routers/authRouter');
const contactRouter = require('./Routers/contactRouter');
const { getMaxListeners } = require('./models/contactModel');
const venderRouter = require('../Backend/Routers/venderRouter')
const customerRouter = require('../Backend/Routers/customerRouter');
const { response } = require('express');


app.use('/users', userRouter)
app.use('/auth', authRouter)
// app.use('/contact',contactRouter)
app.use('/vender',venderRouter)
app.use('/customer',customerRouter)

//////!!!!!
app.get('/contact',(req,res)=>{
    res.sendFile('D:\\krishna\\backend-start\\Vibrill-Hospitality\\Frontend\\contact.html')
})

app.use('/contact-us', async (req, res) => {
    console.log('req', req.body)
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "saksham.vibrill@gmail.com",
            pass: "oloudrhalnqiaptu"
        }
    });
    const mailOptions = {
        from: "saksham.vibrill@gmail.com",
        to: "saksham.walia@vibrillhospitality.com",
        subject: "Contact us form",
        text: `Your Name : ${req.body.first_name}+ ${req.body.last_name}
            Phone No. :${req.body.phone}
            Comment : ${req.body.comment}
        ` ,
    };
    try {
        const status = await transporter.sendMail(mailOptions);
        console.log("email");
        return status;
    } catch (err) {
        console.log(error);
    }
})


app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))


app.post("/signup",
signup = async function signup(req,res){
    try{
        let dataObj = req.body;
        let user = await userModel.create(dataObj);
        sendMail("signup",user);
        if(user){
            return res.redirect('login.html')
        }else{
            res.json({
                message:'error while signing up'
            })
        }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}  
)

app.get('/signup',(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": "*"
    })
    return res.redirect('signup.html')
})



app.post("/login",
    login = async function login(req,res){
        try {
            let data = req.body;
            if(data.email){
                let user = await userModel.findOne({email:data.email});
                if(user){1
                        if(bcrypt.compare(data.password,user.password)){
                            let uid = user['_id'];
                            let token = jwt.sign({payload:uid},JSON.stringify(JWT_KEY));
                            res.cookie('login',token,{httpOnly:true});
                        return res.redirect('login_success.html')
                    }else{
                        return res.json({
                            message:'password wrong'
                        })    
                    }
                    
                }else{
                    return res.json({
                        message:'Invalid user'
                    })
                }
            }
            else{
                return res.json({
                    message:'Empty Field Found'
                })
            }
           } catch (err) {
            return res.status(500).json({
                message:err.message
            })
           }
    }
    
)
app.get('/login',(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": "*"
    })
    return res.redirect('login.html')
})



app.get('/logout',
 logout = async function logout(req,res){
    res.cookie('login', ' ', {maxAge:1});
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    return res.redirect('login.html')
})


app.get('/vender',(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": "*"
    })
    return res.redirect('login_success.html')
})

app.post('/vender',addvender =async function postUser(req,res){
    console.log(req.body)
    let addvender = req.body;
        let vender = await venderModel.create(addvender);
        sendMail("vender",vender);
    // res.json({
    //     message:"Data received successfully",
    //     users:res.body
    // })
    return res.redirect('login_success.html')
    
})

// Vender login

app.post("/vender_login",
    login = async function login(req,res){
        try {
            let data = req.body;
            if(data.email){
                let user = await venderModel.findOne({email:data.email});
                if(user){1
                        if(bcrypt.compare(data.password,user.password)){
                            let uid = user['_id'];
                            let token = jwt.sign({payload:uid},JSON.stringify(JWT_KEY));
                            res.cookie('login',token,{httpOnly:true});
                        return res.redirect('vender_dashboard.html')
                    }else{
                        return res.json({
                            message:'password wrong'
                        })    
                    }
                    
                }else{
                    return res.json({
                        message:'Invalid user'
                    })
                }
            }
            else{
                return res.json({
                    message:'Empty Field Found'
                })
            }
           } catch (err) {
            return res.status(500).json({
                message:err.message
            })
           }
    }
    
)
app.get('/vender_login',(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": "*"
    })
    return res.redirect('vender_login.html')
})

app.get('/vender_logout',
 logout = async function logout(req,res){
    res.cookie('vender_login', ' ', {maxAge:1});
    return res.redirect('vender_login.html')
})


app.get('/customer_details',(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": "*"
    })
    return res.redirect('vender_dashboard.html')
})

app.post('/customer_details',
addcustomer = async function postUser(req,res){
    console.log(req.body)
    let addcustomer = req.body;
        let customer = await customerModel.create(addcustomer);
        sendMail("customer",customer);
    // res.json({
    //     message:"Data received successfully",
    //     users:res.body
    // })
    return res.redirect('vender_dashboard.html')
    
})


app.get('/vender_dash',(req,res)=>{
    db.collection('customermodels').find({}).toArray((err,results)=>{
        if(err) throw err
        res.send(results)
        // console.log(results)
    })
})

app.get('/admin_dash',(req,res)=>{
    db.collection('vendermodels').find({}).toArray((err,results)=>{
        if(err) throw err
        res.send(results)
        // console.log(results)
    })
})


  







