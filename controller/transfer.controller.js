const whalesAccountModel = require('../models/account.model')
const whalesModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const whalesTransactionModel = require('../models/user.transaction')





exports.Pin = async (req,res)=>{
    const {email , oldPin , newPin} = req.body
        let request ={ email ,oldPin ,newPin} 
        console.log(request);
        try{
            const user = await whalesAccountModel.findOne({email: email})  
            console.log(user);

            if(!user){
                return res.json({
                    status: false,
                    message: 'Unregistered email'
                })
            }
            if(user.email !== email ){
                return res.json({
                    status: false,
                    message:'Not authorized'
                })
            }

            if(user.oldPin!==oldPin){
                return res.json({
                    message:'Incorrect Old pin'
                })
            }

                    // user.newPin = newPin
            const updatedUser = await whalesAccountModel.findOneAndUpdate({email},
                {
                    $set:{
                    oldPin:newPin,
                    newPin:'',
                    }
                },
                    {new: true}
            )

            res.json({
                message:'Pin Updated Successfully',
                updated : updatedUser.oldPin
            })

        


        }
        catch(err){
            console.log(err.message);

                
            
        }
                
}

// exports.tokenTransfer = async (req,res)=>{
    
// }

exports.WhalesTransfer = async (req,res)=>{

    let headers = req.headers.authorization

    if(!headers){
        return   res.status(400).json({
        status: false,
        message:'No token Provided'
        })
    }

    const token = await headers.split(' ')[1] 
        jwt.verify(token ,process.env.secret_key,async (err, result)=>{
            if(err){
                console.log(err);
                res.json({
                    status:false,
                    message:'Token is expired or invalid',
                    err: err.message
                })
            }
            else{
                console.log(result);
                    let email = result.email;
                    const user = await whalesModel.findOne({email:email})
                    console.log(user);
                    const sender = await whalesAccountModel.findOne({user:user.id})
                        console.log('sender', sender);
                    
                        if(!sender){  
                            if(!user){
                                return res.json({
                                    message:'sender || user not found'
                                })
                            }
                            }
                    const {accountNumber , amount , oldPin ,description } = req.body
            
                        let whaleMe = {accountNumber , amount , oldPin ,description}
                        let spin = String(oldPin)

                        console.log(whaleMe);

                        let cleanAmount = amount.replace(/,/g, ''); // remove commas
                        let amountNum = parseInt(cleanAmount);

                        try {
                            let receiver = await whalesAccountModel.findOne({accno:accountNumber})
                                console.log('receiver',receiver);

                            if(!receiver){
                                    return res.json({
                                        status: false,
                                        message:'Account dosen`t exist'
                                    })
                                }

                            if(sender.accno === accountNumber ){
                                return res.json({
                                    message:"User account number detected"
                                })
                            } 

                            if (spin!==sender.oldPin ){
                                return res.json({
                                    status: false,
                                    message: 'Incorrect Pin'
                                })
                            }
                            else{

                            

                                if (amountNum<=Number(sender.balance) && amountNum > 0){
                                    

                                    let sendersBalance =Number(sender.balance)- amountNum
                                    let receiverBalance = Number(receiver.balance) + amountNum
                                        
                                const senderCheck =await whalesAccountModel.findByIdAndUpdate(sender._id,{balance: sendersBalance},{new:true})

                                const receiverCheck = await whalesAccountModel.findByIdAndUpdate(receiver._id,{balance:receiverBalance},{new:true})

                                console.log('SEENDER CHECK ', senderCheck);
                                console.log('receiver RECEIVWE', receiverCheck);

                                let receiverName =await whalesModel.findOne({_id:receiver.user})

                                console.log('trying for receiver name',receiverName);
                                


                                let Transaction = new whalesTransactionModel({
                                    
                                    sender_transaction_number:sender._id,
                                    receiver_transaction_number:receiver._id,
                                    sendersName:user.name,
                                    sender_acc_no:sender.accno,
                                    receiver_name:receiverName.name,
                                    receiver_acc_no:receiver.accno,
                                    amount:amountNum,
                                    status: 'successful',
                                    email:sender.email


                                })


                    let senderTransaction = new whalesTransactionModel({
                          sender_transaction_number: sender._id,           // the owner of this transaction
                            type: 'sent',
                            sendersName: user.name,
                            sender_acc_no: sender.accno,
                            receiver_name: receiverName.name,
                            receiver_acc_no: receiver.accno,
                            amount: amountNum,
                            status: 'successful',
                            email: sender.email
                            });

                        // Receiver transaction
                    let receiverTransaction = new whalesTransactionModel({
                            receiver_transaction_number: receiver._id,         // the owner of this transaction
                            type: 'received',
                            sendersName: user.name,
                            sender_acc_no: sender.accno,
                            receiver_name: receiverName.name,
                            receiver_acc_no: receiver.accno,
                            amount: amountNum,
                            status: 'successful',
                            email: receiverName.email // optional, or leave blank
                            });

                        // Save both
                        await senderTransaction.save();
                        await receiverTransaction.save();

                                console.log(Transaction);
                                
                                

                                await Transaction.save(); 

const nodemailer = require('nodemailer');

// Create transporter (using Gmail)
let transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: 'isiakasheriff253@gmail.com',
    pass: 'gqaibxrahcpxhhzl', // your app password
},
});

// ============= 1️⃣ EMAIL TO SENDER =====================
let senderMailOptions = {
from: 'youremail@gmail.com',
to: [sender.email, 'isiakasheriff05@gmail.com'], // sender + admin copy
subject: 'Transfer Successful — WhaleBank',
html: `
<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: Arial, sans-serif; background: #f5f9f7; color: #333; }
    .container { background: #fff; border-radius: 10px; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #dceae3; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
    .header { background: #519074; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0; }
    .highlight { color: #519074; font-weight: bold; }
    .details { background: #f3f7f5; padding: 15px; border-radius: 8px; margin-top: 10px; }
    .footer { font-size: 12px; text-align: center; color: #777; margin-top: 15px; }
</style>
</head>
<body>
    <div class="container">
    <div class="header">🐋 WhaleBank</div>

    <p>Dear <strong>${sender.name}</strong>,</p>
    <p>Your transfer of <span class="highlight">₦${amountNum.toLocaleString()}</span> was <strong>successful</strong>.</p>
    <p>Your current balance is <strong>₦${senderCheck.balance.toLocaleString()}</strong>.</p>

    <div class="details">
        <h4>Transaction Details</h4>
        <div><strong>Receiver:</strong> ${receiverName.name}</div>
        <div><strong>Bank:</strong> WhaleBank</div>
        <div><strong>Account Number:</strong> ${receiver.accno}</div>
        <div><strong>Amount Sent:</strong> ₦${amountNum.toLocaleString()}</div>
        <div><strong>Transaction ID:</strong> ${Transaction._id}</div>
        <div><strong>Date:</strong> ${new Date().toLocaleString()}</div>
    </div>

    <p>Thank you for banking with <span class="highlight">WhaleBank</span> 🐋</p>

    <div class="footer">
        WhaleBank Digital Services © 2025 — Licensed by the CBN
    </div>
    </div>
</body>
</html>
`
};

// ============= 2️⃣ EMAIL TO RECEIVER =====================
let receiverMailOptions = {
from: 'youremail@gmail.com',
to: receiver.email, // receiver email from DB
subject: 'Credit Alert — WhaleBank',
html: `
<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: Arial, sans-serif; background: #f5f9f7; color: #333; }
    .container { background: #fff; border-radius: 10px; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #dceae3; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
    .header { background: #519074; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0; }
    .highlight { color: #519074; font-weight: bold; }
    .details { background: #f3f7f5; padding: 15px; border-radius: 8px; margin-top: 10px; }
    .footer { font-size: 12px; text-align: center; color: #777; margin-top: 15px; }
</style>
</head>
<body>
    <div class="container">
    <div class="header">🐋 WhaleBank</div>

    <p>Dear <strong>${receiverName.name}</strong>,</p>
    <p>You’ve received <span class="highlight">₦${amountNum.toLocaleString()}</span> from <strong>${sender.name}</strong>.</p>

    <div class="details">
        <h4>Transaction Details</h4>
        <div><strong>Sender:</strong> ${sender.name}</div>
        <div><strong>Bank:</strong> WhaleBank</div>
        <div><strong>Account Number:</strong> ${sender.accno}</div>
        <div><strong>Amount Received:</strong> ₦${amountNum.toLocaleString()}</div>
        <div><strong>Transaction ID:</strong> ${Transaction._id}</div>
        <div><strong>Date:</strong> ${new Date().toLocaleString()}</div>
    </div>

    <p>Thank you for using <span class="highlight">WhaleBank</span> 🐋</p>

    <div class="footer">
        WhaleBank Digital Services © 2025 — Licensed by the CBN
    </div>
    </div>
</body>
</html>
`
};

// ============= 3️⃣ SEND BOTH EMAILS =====================
transporter.sendMail(senderMailOptions, (error, info) => {
if (error) console.log('Sender Mail Error:', error);
else console.log('Sender Mail Sent:', info.response);
});

if (receiver.email) {
transporter.sendMail(receiverMailOptions, (error, info) => {
    if (error) console.log('Receiver Mail Error:', error);
    else console.log('Receiver Mail Sent:', info.response);
});
}




                                
                                return res.json({
                                    status:true,
                                    message: 'Transfer successful',
                                    balance: senderCheck.balance,
                                    amount:amountNum,
                                    Transaction:Transaction
                                })

                                }

                                else{
                                    return res.json({
                                        status:false,
                                        message:'Insufficient Balance'
                                    })
                                }
                            }
                        }
                        catch(err){
                            console.log(err.message);
                            return res.json({
                                err: err.message
                            })
                            
                        }



                                
                
            }
        })
        // transfer by whale ,
    
        
        
        
        
}

exports.getAllTransaction = async (req,res)=>{
    let headers = req.headers.authorization

    if(!headers){
        return   res.status(400).json({
        status: false,
        message:'No token Provided'
        })
    }

    const token = await headers.split(' ')[1] 
    jwt.verify(token ,process.env.secret_key,async (err, result)=>{
            if(err){
                console.log(err);
                res.json({
                    status:false,
                    message:'Token is expired or invalid',
                    err: err.message
                })
            }
            else{
                console.log(result);
                    let email = result.email;
                    const user = await whalesTransactionModel.find({email:email}).sort({ createdAt: -1 })
                    console.log(user);
                     return res.json(user); // 
            }
        })


}



exports.getContact = async (req,res)=>{
    const {name , email , subject, message} = req.body

        const user = await whalesModel.findOne({email: email})
            if (!user){
                return res.json({
                    status : false,
                    message: 'Unregistered Email'
                })
            }
                    let nodemailer = require('nodemailer');

        let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'isiakasheriff253@gmail.com',
            pass: 'gqaibxrahcpxhhzl'
        }
        });

        let mailOptions = {
        from: 'youremail@gmail.com',
        to: ['isiakasheriff253@gmmail.com', 'isiakasheriff05@gmail.com'],
        subject: 'Feedback',
            html:   `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>🐋 New Contact Message — Whale Enterprise</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background:#f9f9f9;padding:10px;border-radius:5px;">
                ${message}
            </div>
            <hr/>
            <p style="font-size:12px;color:#888;">This message was sent from the WhaleBank contact form.</p>
            </div>`

        }
        return res.json({
            status: true,
            
        })
        


        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });


}