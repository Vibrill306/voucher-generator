const express = require("express")
const venderRouter = express.Router();
const venderModel = require('../models/venderModel')
const { addvender } = require('../controller/venderController');

venderRouter
.route('/vender')
.post(addvender)




module.exports = venderRouter;