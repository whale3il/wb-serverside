const mongoose = require ('mongoose')

let whalesAccountSchema = mongoose.Schema({
    
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'whalesBank',
        // required: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    accno:{
        type:String,
        required: true,
        unique:true
    },
    balance:{
        type:Number,
        default:0
    },
    anotherPassword:{
        type:String,
        required: false
    },
    description:{
        type:String,
        required: false
    },
    oldPin:{
        type:String,
        default:'1234',
        required: false,
    },
    newPin : {  
        type:String,
        required:false,
        default:""
    },
        lastClaim: {
    type: Date,
    default: null
        }   

})

let whalesAccountModel= mongoose.model('whalesAccount',whalesAccountSchema)

module.exports = whalesAccountModel