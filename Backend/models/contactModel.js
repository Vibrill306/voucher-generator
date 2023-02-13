const mongoose = require('mongoose');
const db_link = 'mongodb+srv://admin:IVaCDFjcRtf5oF3z@cluster0.rcbcaho.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(db_link).then(
    function(db){
        // console.log('Plan db connected')
    }
)
.catch(function(err){
    console.log(err)
})

const contactSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required :true,
        maxlength:[20,'plan name should not exceed more then 20 characters']
    },
    lastName:{
        type : String,
        required :true,
        maxlength:[20,'plan name should not exceed more then 20 characters']
    },
    email:{
        type:String,
        required :true,
    },
    phoneUmber:{
        type:Number,
        required :true,
    },
    comment:{
        type:String,
        required:true,
    }
})
//model

const contactModel = mongoose.model('contactUser',contactSchema);

module.exports = contactModel;