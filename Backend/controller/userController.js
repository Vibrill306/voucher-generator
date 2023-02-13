const userModel = require('../models/userModel')

const protectRoute = require('../Routers/authHelper')



// module.exports.getUsers =async function getUsers(req,res){
//     let allUsers = await userModel.find();
//     res.json({
//         message:'list of all users',
//         data:allUsers
//     })
// }

module.exports.getUser = async function getUser(req,res){
    let id = req.params.id;
    try{
        let users = await userModel.findById(id)
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

module.exports.postUser = function postUser(req,res){
    console.log(req.body)
    users=req.body
    res.json({
        message:"Data received successfully",
        users:res.body
    })
}


// module.exports.deleteUser = function deleteUser(req,res){
//     users={};
//     res.json({
//         message:"Deleted successfully"
//     })
// }


// module.exports.updateUser = async function updateUser(req,res){
//     console.log(req.body);
//     let dataToBeUpdated = req.body;
//     let user = await userModel.findOneAndUpdate({email:"sakshi@gmail.com"},dataToBeUpdated);
    
//     // console.log(dataToBeUpdated)
//     res.json({
//         message:"data updated successfully",
//         data:user
//     })
// }

module.exports.updateUser = async function updateUser(req,res){
        try{
            let id = req.params.id;
            let user = await userModel.findById(id);
            let dataToBeUpdated = req.body;

            if(user){
                const keys = [];
                for(let key in dataToBeUpdated){
                    keys.push(key);
                }
                for(let i=0; i<keys.length; i++){
                    user[keys[i]] = dataToBeUpdated[keys[i]];
                }
                const updatedData = await user.save();
                res.json({
                    message:"data updated successfully",
                    data:updatedData
                })
            }else{
                res.json({
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



module.exports.deleteUser = async function deleteUser(req,res){
   try{
        let id = req.params.id;
        let user = await userModel.findByIdAndDelete(id);

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
}


module.exports.getUserById = function getUserById(req,res){
    console.log(req.params.id);
    let paramId = req.params.id;
    let obj = {};
    for(let i=0; i<users.length; i++){
        if(users[i]['id']==paramId){
            obj=users[i]
        }
    }
    res.json({
        message:"req received",
        data:obj
    })

}

module.exports.getAllUser = async function getAllUser(req,res){
    try{
        let users = await userModel.find();
        if(users){
            res.json({
                message:'users retrieved',
                data:users
            })
            res.send('user id received');
        }
        else{
            res.send("Not received")
        }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

module.exports.updateProfilImage = function updateProfileImage(req,res){
    res.json({
        message:'file uploaded successfully'
    })
}