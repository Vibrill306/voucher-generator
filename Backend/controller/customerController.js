const customerModel = require('../models/customerModel')

module.exports.addcustomer = async function getUser(req,res){
    let id = req.params.id;
    try{
        let users = await customerModel.findById(id)
    if(users){
        return res.json({
            message:'user',
            data:users
        });
    }else{
        return res.json({
            message:"user not found"
        })
    }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

module.exports.addcustomer = function postUser(req,res){
    console.log(req.body)
    users=req.body
    res.json({
        message:"Data received successfully",
        users:res.body
    })
}
