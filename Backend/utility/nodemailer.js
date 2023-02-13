"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports.sendMail=async function sendMail(str,data) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'krishna.vibrill@gmail.com', // generated ethereal user
      pass: 'qrdksuwtxpyhghri', // generated ethereal password
    },
  });

  var Osubject,Otext,Ohtml;
  if(str=='signup'){
    Osubject=`Thank you for Signing up ${data.name}`;
    Ohtml=`
    <h1>Welcome to practice_app</h1>
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
    <h1>Vibrill voucher</h1>
    Name - ${data.name}<br>
    Email - ${data.email}<br>
    Phone No. -${data.phone}<br>
    City - ${data.city}<br>
    Voucher - ${data.voucher}<br>
    <b>This is your ${data.voucher} from Vibrill Hospitality</b>
    `
  }
  else if(str=="resetpassword"){
    Osubject=`Reset Password`;
    Ohtml=`
    <h1>vibrill_voucher.com</h1>
    Here is your link to reset your password !
    ${data.resetPasswordLink}`
  }

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Vibrill Voucher" <krishna.vibrill@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: Osubject, // Subject line
    // text: "Hello world?", // plain text body
    html: Ohtml, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// sendMail().catch(console.error);
