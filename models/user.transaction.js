const mongoose = require('mongoose')

const whalesTransactionSchema = mongoose.Schema({
    sender_transaction_number: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'whalesAccount'
    },
    receiver_transaction_number: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'whalesAccount'
    },
    sendersName:{
        type:String,
        required: false
    },
    sender_acc_no:{
        type:String,
        required: false
    },
    receiver_name:{
        type:String,
        required: false
    },
    receiver_acc_no:{
        type:String,
        required: false
    },
    amount:{
        type:Number,
        required: false
    },
    status:{
        type: String,
        default:'successful'
    },email:{
        type: String,
        required:'false'
    },type:{
        type:String,
        required:false
    }
    
}, { timestamps: true })

let whalesTransactionModel = mongoose.model('Transaction', whalesTransactionSchema)

module.exports = whalesTransactionModel