const { default: mongoose } = require('mongoose')
const moongoose = require('mongoose')

let whalesBankSchema = mongoose.Schema({
    name: {
        type: String,
        required :true
    },
    // lastname:{
    //     type:String,
    //     required: true
    // },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    account :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'whalesAccount'
    }


})

let whalesModel = moongoose.model('whalesBank', whalesBankSchema)

module.exports = whalesModel