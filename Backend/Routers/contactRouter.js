const express = require("express")
const contactRouter = express.Router();

const contactController = require('../controller/contactController')
// contactRouter.get('/contact-us',contactController.sendMail)
// app.use('/contact-us',(req,res)=>res.send('hello'))
contactRouter.route('/send').get((req, res)=>{
    res.send('rcexawz')
})