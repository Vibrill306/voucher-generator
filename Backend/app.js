const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const JWT_KEY = require('../secrets')
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')
const { db } = require('./models/userModel');
const userModel = require('../Backend/models/userModel');
const venderModel = require('../Backend/models/venderModel');
const customerModel = require('../Backend/models/customerModel');
const { sendMail } = require('../Backend/utility/nodemailer')
const bcrypt = require('bcrypt')
const userRouter = require('../Backend/Routers/userRouter')
const authRouter = require('../Backend/Routers/authRouter');
const contactRouter = require('./Routers/contactRouter');
const { getMaxListeners } = require('./models/contactModel');
const venderRouter = require('../Backend/Routers/venderRouter')
const customerRouter = require('../Backend/Routers/customerRouter');
const { response } = require('express');
const pdf = require('html-pdf');

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
app.use(express.json());
app.use(cookieParser())
require('dotenv').config();
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/vender', venderRouter)
app.use('/customer', customerRouter)
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))


// Send Mail and Convert to PDF

const html = (data) => {
    if(data.voucher === "Resort Voucher"){
    return `<html><body>${` <div class="coupon" style="border: 5px dotted #bbb;
    width: 80%;
    border-radius: 15px;
    margin: 0 auto;
    max-width: 600px;">
    <div class="container" style="padding: 2px 16px;
    background-color: #f1f1f1;">
    <h3 style="color:red;">Vibrill Hospitality</h3>
    </div>
    <img src="../public/images/man.png" alt="Avatar" style="width:100%;">
    <div class="container" style="background-color:white;">
    <h2 ><b>${data.voucher}</b></h2> 
    <p>${data.name}<br>${data.email}<br>${data.phone}<br>${data.city}</p>
    </div>
    <div class="container">
    <p>Use Promo Code: <span class="promo" style="background: #ccc;
    padding: 3px;">BOH232</span></p>
    <p class="expire" style="color: red;">Expires: Jan 03, 2021</p>
    </div>
    </div>`} </body></html>`;
}else if(data.voucher === "Movie Voucher"){
    return `<html><body>${` <div class="coupon" style="border: 5px dotted #bbb;
    width: 80%;
    border-radius: 15px;
    margin: 0 auto;
    max-width: 600px;">
    <div class="container" style="padding: 2px 16px;
    background-color: #f1f1f1;">
    <h3 style="color:red;">Vibrill Hospitality Movie Voucher</h3>
    </div>
    <img src="../public/images/man.png" alt="Avatar" style="width:100%;">
    <div class="container" style="background-color:white;">
    <h2 ><b>${data.voucher}</b></h2> 
    <p>${data.name}<br>${data.email}<br>${data.phone}<br>${data.city}</p>
    </div>
    <div class="container">
    <p>Use Promo Code: <span class="promo" style="background: #ccc;
    padding: 3px;">BOH232</span></p>
    <p class="expire" style="color: red;">Expires: Jan 03, 2021</p>
    </div>
    </div>`} </body></html>`;
}else{
    return `<html><body>${` <div class="coupon" style="border: 5px dotted #bbb;
    width: 80%;
    border-radius: 15px;
    margin: 0 auto;
    max-width: 600px;">
    <div class="container" style="padding: 2px 16px;
    background-color: #f1f1f1;">
    <h3 style="color:red;">Vibrill Hospitality Holiday Voucher</h3>
    </div>
    <img src="../public/images/man.png" alt="Avatar" style="width:100%;">
    <div class="container" style="background-color:white;">
    <h2 ><b>${data.voucher}</b></h2> 
    <p>${data.name}<br>${data.email}<br>${data.phone}<br>${data.city}</p>
    </div>
    <div class="container">
    <p>Use Promo Code: <span class="promo" style="background: #ccc;
    padding: 3px;">BOH232</span></p>
    <p class="expire" style="color: red;">Expires: Jan 03, 2021</p>
    </div>
    </div>`} </body></html>`;
}}

// Dashboard Signup Here 

app.post("/signup",
    signup = async function signup(req, res) {
        try {
            let dataObj = req.body;
            let user = await userModel.create(dataObj);
            sendMail("signup", user);
            if (user) {
                return res.redirect('login.html')
            } else {
                res.json({
                    message: 'error while signing up'
                })
            }
        }
        catch (err) {
            res.json({
                message: err.message
            })
        }
    }
)

app.get('/signup', (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": "*"
    })
    return res.redirect('signup.html')
})

// Dashboard Login Here 

app.post("/login",
    login = async function login(req, res) {
        try {
            let data = req.body;
            if (data.email) {
                let user = await userModel.findOne({ email: data.email });
                const match = await bcrypt.compare(data.password, user.password);
                if (user && match) {
                    if(bcrypt.compare(user.password,data.password))
                    {
                        let uid = user['_id'];
                        let token = jwt.sign({ payload: uid }, JSON.stringify(JWT_KEY));
                        res.cookie('login', token, { httpOnly: true });
                        res.cookie('is_login', true, { httpOnly: false });
                        return res.redirect('login_success.html')
                    } else {
                        return res.json({
                            message: 'password wrong'
                        })
                    }

                } else {
                    return res.json({
                        message: 'Invalid user'
                    })
                }
            }
            else {
                return res.json({
                    message: 'Empty Field Found'
                })
            }
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    }

)
app.get('/login', (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": "*"
    })
    return res.redirect('login.html')
})



app.get('/logout', logout = async function logout(req, res) {
        res.clearCookie('login');
        res.clearCookie('is_login');
        return res.redirect('login.html')
    })


// Add Vender Here 

app.post('/vender', addvender = async function postUser(req, res) {
    let addvender = req.body;
    const { company_id, company_name, email, phone, password, city, ...rest } = addvender;
    const voucher = Object.values(rest)
    const request = { company_id, company_name, email, password, phone, city, voucher }
    let vender = await venderModel.create(request);
    sendMail("vender", vender);
    return res.redirect('login_success.html')

})

app.get('/vender', (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": "*"
    })
    return res.redirect('login_success.html')
})

// Vender login Here

app.post("/vender_login",
    login = async function login(req, res) {
        try {
            let data = req.body;
            if (data.email) {
                let vender = await venderModel.findOne({ email: data.email});
                const match = await bcrypt.compare(data.password, vender.password);
                if (vender && match) {
                    if (bcrypt.compare(data.password, vender.password)) {
                        let uid = vender['_id'];
                        let token = jwt.sign({ payload: uid }, JSON.stringify(JWT_KEY));
                        res.cookie('login', token, { httpOnly: true });
                        res.cookie('vender_id', vender.company_id, { httpOnly: false });
                        res.cookie('is_login', true, { httpOnly: false });
                        return res.redirect('vender_dashboard.html')
                    } else {
                        return res.json({
                            message: 'password wrong'
                        })
                    }
                        
                }
                 else {
                    return res.json({
                        message: 'Invalid user'
                    })
                }
            }
            else {
                return res.json({
                    message: 'Empty Field Found'
                })
            }
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    }

)
app.get('/vender_login', (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": "*"
    })
    return res.redirect('vender_login.html')
})

app.get('/vender_logout',
    logout = async function logout(req, res) {
        res.clearCookie('vender_id');
        res.clearCookie('login');
        res.clearCookie('is_login');
        return res.redirect('vender_login.html')
    })


// Add Customer Here 

app.post('/customer_details', addcustomer = async function postUser(req, res) {
        let addcustomer = req.body;
        customerModel.create(addcustomer).then((res) => {
            sendMail("customer", res);
            pdf.create(html(res), { format: 'A4' }).toFile('Voucher.pdf', function (err, res) {
                if (err) return console.log(err);
                console.log(res);
            })
        })
        return res.redirect('vender_dashboard.html')

    })

    app.get('/customer_details', (req, res) => {
        res.set({
            "Allow-access-Allow-Origin": "*"
        })
        return res.redirect('vender_dashboard.html')
    })    


app.get('/vender_dash', (req, res) => {
    db.collection('customermodels').find({ company_id: req.cookies.vender_id }).toArray((err, results) => {
        if (err) throw err
        res.send(results)
        // console.log(results)
    })
})

app.get('/vender_dashb', (req, res) => {
    db.collection('customermodels').find().toArray((err, results) => {
        if (err) throw err
        res.send(results)
        // console.log(results)
    })
})

//vender details API

app.get('/admin_dash', (req, res) => {
    db.collection('vendermodels').find({}).toArray((err, results) => {
        if (err) throw err
        res.send(results)
        // console.log(results)
    })
})

//Customer details API

app.get('/customer_by_company_id', (req, res) => {
    db.collection('vendermodels').find({ company_id: req.cookies.vender_id }).toArray((err, results) => {
        if (err) throw err
        res.send(results)
        // console.log(results)
    })
})


// not working code

app.delete('/admin_dash/:id',deleteUser = async function deleteUser(req,res){
    try{
         let id = req.params.id;
         let user = await venderModel.findByIdAndDelete(id);
 
         if(!user){
             res.json({
                 message:"user not found"
             })
         }res.json({
             message:"data has been deleted",
             data:user
         })
    }
    catch(err){
         res.json({
             message:err.message
         })
    }
 })


 app.patch('/allCustomers/:id', 
    function statusUpdate(req,res){
        const id = req.body._id
        customerModel.findByIdAndUpdate(id, function reedemed(){{
            const status = document.getElementById("delete-button")
            
                if(status.innerHTML === "Unredeem"){
                    status.innerHTML = "Redeemed"
                  }else{
                    status.innerHTML = "Unredeem"
                  }
            }
        }
     )}
 )