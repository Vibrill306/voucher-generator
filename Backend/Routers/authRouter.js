const express = require('express');
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const JWT_KEY = require('../../secrets.js')
const authRouter = express.Router();

// authRouter
// .route('/signup')
// .get(middleware1,getSignUp,middleware2)
// .get(getSignUp)
// .post(postSignUp)

// authRouter
// .route('/login')
// .post(loginUser)



// function middleware1(req,res,next){
//     console.log('middlewar1 encountered')
//     next();
// }

// function middleware2(req,res){
//     console.log('middlewar2 encountered')
//     console.log('middleware2 ended');
//     res.sendFile('/public/index.html',{root:__dirname})
// }


// function getSignUp(req,res){
//     res.sendFile('/public/index.html',{root:__dirname});
//     console.log(req.body)
//     // next();
// }

// async function postSignUp(req,res){
//     let dataObj = req.body
//     let user = await userModel.create(dataObj);
//     console.log('get signud called');
//     res.json({
//         message:"user signed up",
//         data:user
//     })
// }

// async function loginUser(req,res){
//    try {
//     let data = req.body;
//     if(data.email){
//         let user = await userModel.findOne({email:data.email});
//         if(user){
//                 if(user.password == data.password){
//                     let uid = user['_id'];
//                     let token = jwt.sign({payload:uid},JSON.stringify(JWT_KEY));
//                     res.cookie('login',token,{httpOnly:true});
//                 return res.json({
//                     message:'user has logged in',
//                     userDetails:data
//                 })  
//             }else{
//                 return res.json({
//                     message:'password wrong'
//                 })    
//             }
            
//         }else{
//             return res.json({
//                 message:'Invalid user'
//             })
//         }
//     }
//     else{
//         return res.json({
//             message:'Empty Field Found'
//         })
//     }
//    } catch (err) {
//     return res.status(500).json({
//         message:err.message
//     })
//    }
// }

module.exports = authRouter