const express = require('express');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('../../secrets')
const {sendMail} = require('../utility/nodemailer')

module.exports.signup = async function signup(req,res){
    try{
        let dataObj = req.body;
        let user = await userModel.create(dataObj);
        sendMail("signup",user);
        if(user){
            return res.json({
                message:'user signed up',
                data : user
            })
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

//login user

module.exports.login = async function login(req,res){
    try {
        let data = req.body;
        if(data.email){
            let user = await userModel.findOne({email:data.email});
            if(user){
                    if(user.password == data.password){
                        let uid = user['_id'];
                        let token = jwt.sign({payload:uid},JSON.stringify(JWT_KEY));
                        res.cookie('login',token,{httpOnly:true});
                    return res.json({
                        message:'user has logged in',
                        userDetails:data
                    })  
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

module.exports.isAuthorised = function isAuthorised(roles){
    return function(req,res,next){
        if(roles.include(req.role)==true){
            next();
        }else{
            res.status(401).json({
                message:'operation not allowed'
            })
        }
    }
}


module.exports.protectRoute = async function protectRoute(req,res,next){
    
    if(req.cookies.isLoggedIn){
        try{
            let token;
            if(req.cookies.login){
                console.log(req.cookies);
                token = req.cookies.login;
                let payload = jwt.verify(token,JWT_KEY)
                if(payload){
                    const user = await userModel.find(payload.payload);
                    req.role = user.role;
                    req.id = user.id;
                    return res.json({
                        message:"user not verified"
                    })
                }else{
                    returnres.json({
                        message:"Please login again"
                    })
                }
            }else{
                    res.json({
                        message:"please login"
                    })
                }
            
        }
        catch(err){
            return res.json({
                message:err.message
            })
        }
    }
}


module.exports.forgetpassword = async function forgetpassword(req,res,next){
    let{email} = req.body;

    try{
        const user = await userModel.findOne({email:email});
        if(user){
            const resetToken = user.createResetToken();
            //https:/abc.com/resetpassword/resetToken
            let resetPasswordLink = `${req.protocol}://${req.get('host')}/restpassword/${resetToken}`;
            //send email to the user(nodemailer)
            let obj={
                resetPasswordLink:resetPasswordLink,
                email:email
            }
            sendMail('resetpassword',obj);
            return res.json({
                message:'reset successfully'
            })
        }else{
            return res.json({
                message:"Please Signup"
            })
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}


module.exports.resetpassword = async function resetpassword(req,res){
    try{
        const token = req.params.token;
        let {password, confirmPassword} = req.body
        const user = await userModel.findOne({resetToken:token});
        if(user){
            //resetpssword haandler will update user'sin db
            user.resetPasswordHandler(password,confirmPassword)
            await user.save();

            res.json({
                message:"Password Change Successfully login again"
            })
        }else{
            res.json({
                message:"User not Found"
            })
        }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

module.exports.logout = function logout(req,res){
    res.cookie('login', ' ', {maxAge:1});
    res.json({
        message : "User Logout Successfully"
    })
}