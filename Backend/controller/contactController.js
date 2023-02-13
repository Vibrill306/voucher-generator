const express = require('express');
const contactModel = require('../models/contactModel');


module.exports.sendMail = (req,res)=>{
    // console.log('req',req.body)
    res.send('hello');
}
