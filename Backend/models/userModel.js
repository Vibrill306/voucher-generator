const mongoose  = require('mongoose');
const emailValidate = require('email-validator');
const bcrypt=require('bcrypt')
const crypto = require('crypto')

const db_link = 'mongodb+srv://admin:IVaCDFjcRtf5oF3z@cluster0.rcbcaho.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link).then(function(db){
    console.log('db connection')
}).catch(function(err){
    console.log(err);
})

//schema

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
            return emailValidate.validate(
                this.email
            )
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    confirmPassword:{
        type:String,
        // required:true,
        minLength:8,
        validate:function(){
            this.confirmPassword==this.password
        }
    },
    role:{
        type:String,
        enum:['admin','user','owner'],
        default:'user'
    },
    profileImage:{
        type:String,
        default:'/images/src/default.jpg'
    },
    resetToken : String
})

// Mongoose Hooks

// userSchema.pre('save',function(){
//     console.log('before saving in db',this)
// });

// userSchema.post('save',function(doc){
//     console.log('after saving in db',doc)
// })

userSchema.pre('save',function(){
    this.confirmPassword = undefined;
})

userSchema.pre('save',async function(next){
    let salt = await bcrypt.genSalt();
    let hashedString = await bcrypt.hash(this.password,salt);
    console.log(hashedString);
    this.password = hashedString 
    next()
})

userSchema.methods.createResetToken = function(){
    //creating unique token using npm crypto
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler = function(password,confirmPassword){
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.resetToken = undefined
}

const userModel = mongoose.model('userModel',userSchema);

module.exports = userModel