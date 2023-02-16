"use strict";
const nodemailer = require("nodemailer");

module.exports.sendMail=async function sendMail(str,data) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: 'krishna.vibrill@gmail.com', 
      pass: 'qrdksuwtxpyhghri',
    },
  });

  var Osubject,Otext,Ohtml;
  if(str=='signup'){
    Osubject=`Thank you for Signing up ${data.name}`;
    Ohtml=`
    <h1>Welcome to Vibrill Voucher</h1>
    Hope you have good time !
    Here are your details-
    Name - ${data.company_name}<br>
    Email - ${data.email}<br>`
  } else if(str == 'vender'){
    Osubject=`Welcome ${data.company_name}`;
    Ohtml=`
    <h1>Vibrill voucher</h1>
    Company Name - ${data.company_name}<br>
    Email - ${data.email}<br>
    Password - ${data.password}<br>
    
    `
  } else if(str == 'customer'){
    Osubject=`Welcome ${data.name}`;
    Ohtml=`
    <div class="coupon" style="border: 5px dotted #bbb;
    width: 80%;
    border-radius: 15px;
    margin: 0 auto;
    max-width: 600px;">
  <div class="container" style="padding: 2px 16px;
  background-color: #f1f1f1;">
    <h3>Vibrill Hospitality</h3>
  </div>
  <img src="../public/images/man.png" alt="Avatar" style="width:100%;">
  <div class="container" style="background-color:white;">
    <h2 ><b>${data.voucher}</b></h2> 
    <p >${data.name}<br>${data.email}<br>${data.phone}<br>${data.city}</p>
  </div>
  <div class="container">
    <p>Use Promo Code: <span class="promo" style="background: #ccc;
    padding: 3px;">BOH232</span></p>
    <p class="expire" style="color: red;">Expires: Jan 03, 2021</p>
  </div>
</div>`;
  }
  else if(str=="resetpassword"){
    Osubject=`Reset Password`;
    Ohtml=`
    <h1>vibrill_voucher.com</h1>
    Here is your link to reset your password !
    ${data.resetPasswordLink}`
  }

  let info = await transporter.sendMail({
    from: '"Vibrill Voucher" <krishna.vibrill@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: Osubject, // Subject line
    // text: "Hello world?", // plain text body
    html: Ohtml, // html body
    attachments:[
        {filename:'Voucher.pdf', path:'./Voucher.pdf'}
      ]
  });

  console.log("Message sent: %s", info.messageId);
}
