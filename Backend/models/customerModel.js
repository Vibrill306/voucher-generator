const mongoose  = require('mongoose');
const emailValidate = require('email-validator');

const db_link = 'mongodb+srv://admin:IVaCDFjcRtf5oF3z@cluster0.rcbcaho.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link).then(function(db){
    console.log('Customer db connection')
}).catch(function(err){
    console.log(err);
})

const customerSchema = mongoose.Schema({
    company_id:{
        type:String,
        required:true
    },
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
    phone:{
        type:String,
        required:true,
        minLength:10
    },
    age:{
        type:Number,
        required:true,
        minLength:10
    },
    city:{
        type:String,
        required:true
    },
    voucher:{
        type:String,
        voucher:['Movie Voucher','Resort Voucher','Holiday Voucher'],
        default:'Movie Voucher'
    },
    status:{
        type:String,
        required:true,
        default:'Unredeem'
    }
})


const customerModel = mongoose.model('customerModel',customerSchema);

module.exports = customerModel