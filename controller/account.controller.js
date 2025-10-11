const whalesAccountModel = require("../models/account.model");


exports.createAccountNumber = async(req,res) =>{
    let accountNumber;
    let status = false

        while(!status){

            accountNumber= Math.floor(100000000000 + Math.random() * 900000000000).toString();
        
            const existingAccount = await whalesAccountModel.findOne({accno:accountNumber })

            if(!existingAccount){
                status = true
            }

            
        }

        return accountNumber

}

exports.addAccountDetails = async (req,res)=>{
    // const {email, occupation , gender}
}