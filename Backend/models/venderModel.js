const mongoose  = require('mongoose');
const emailValidate = require('email-validator');
const bcrypt=require('bcrypt')
const crypto = require('crypto')

const db_link = 'mongodb+srv://admin:IVaCDFjcRtf5oF3z@cluster0.rcbcaho.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link).then(function(db){
    console.log('Vender db connection')
}).catch(function(err){
    console.log(err);
})

const venderSchema = mongoose.Schema({
    company_id:{
        type:String,
        required:true
    },
    company_name:{
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
    phone:{
        type:Number,
        required:true,
        minLength:10
    },
    city:{
        type:String,
        required:true
    },
    voucher:{
        type:Object,
        "voucher1":['Movie Voucher'],
        "voucher2":['Resort Voucher'],
        "voucher3":['Holiday Voucher'],
        default:'Movie Voucher'
    },
})


venderSchema.pre('save',function(){
    this.confirmPassword = undefined;
})

venderSchema.pre('save',async function(next){
    let salt = await bcrypt.genSalt();
    let hashedString = await bcrypt.hash(this.password,salt);
    console.log(hashedString);
    this.password = hashedString 
    next()
})

const venderModel = mongoose.model('venderModel',venderSchema);

module.exports = venderModel