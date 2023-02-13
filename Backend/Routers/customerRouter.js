const express = require("express")
const customerRouter = express.Router();
const customerModel = require('../models/customerModel')
const { addcustomer } = require('../controller/customerController');

customerRouter
.route('/customer')
.post(addcustomer)




module.exports = customerRouter;