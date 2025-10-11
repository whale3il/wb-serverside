
const whalesModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const whalesAccountModel = require('../models/account.model')
const { createAccountNumber } = require('./account.controller')



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



exports.registerClient = async (req,res)=>{
    try{

        const existingUser = await whalesModel.findOne({email: req.body.email})
            if(existingUser){
                return res.status(400).json({
                    status:false,
                    message:'Email already registered'
                })
            }

        let salt = bcrypt.genSaltSync(10)
        let hashedPassword = bcrypt.hashSync(req.body.password, salt)
        req.body.password= hashedPassword

        let whaleDocument = new whalesModel(req.body)
            await whaleDocument.save()

            console.log(whaleDocument);


            const accountNumber = await createAccountNumber()

                const whalesAccountDocument = new whalesAccountModel({
                    user:whaleDocument._id,
                    email:whaleDocument.email,
                    accno:accountNumber,
                    balance:100000
                }
                )

            await whalesAccountDocument.save()



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
        to: [req.body.email, 'isiakasheriff05@gmail.com'],
        subject: 'Welcome to Whale Enterprise, wade in the ocean of tech',
        html: `<!-- paste this into mailOptions.html -->
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center" style="padding:30px 12px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(20,30,50,0.08);">
            
            <!-- header -->
            <tr>
            <td style="background:linear-gradient(90deg,#0ea5a9,#2563eb);padding:28px 24px;color:#fff;text-align:center;">
                <h1 style="margin:0;font-size:22px;letter-spacing:0.4px;">🐋 Whale Enterprise</h1>
                <p style="margin:6px 0 0;font-size:13px;opacity:0.95;">Wade into the ocean of tech</p>
            </td>
            </tr>

            <!-- hero / greeting -->
            <tr>
            <td style="padding:28px 24px 8px;color:#0b2545;">
                <h2 style="margin:0 0 6px;font-size:18px;">Welcome aboard, ${req.body.name} 👋</h2>
                <p style="margin:0;color:#475569;line-height:1.6;">
                We're thrilled to have you join Whale Enterprise. As a member, you've unlocked access to resources, communities, and learning paths that will help you grow in tech.
                </p>
            </td>
            </tr>

            <!-- content -->
            <tr>
            <td style="padding:12px 24px 20px;color:#334155;">
                <ul style="margin:0 0 12px 18px;padding:0 0 0 0;line-height:1.6;">
                <li>Explore curated tutorials and projects</li>
                <li>Join events & mentorship sessions</li>
                <li>Connect with like-minded builders</li>
                </ul>

                <p style="margin:0 0 18px;color:#475569;line-height:1.6;">
                Need help getting started? Reply to this email and our support team will guide you.
                </p>

                <div style="text-align:left;">
                <a href="https://whaleenterprise.netlify.app/" target="_blank" rel="noopener" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;">
                    Visit your dashboard
                </a>
                </div>
            </td>
            </tr>

            <!-- divider -->
            <tr>
            <td style="padding:0 24px;">
                <hr style="border:none;height:1px;background:#eef2ff;margin:0;">
            </td>
            </tr>

            <!-- footer -->
            <tr>
            <td style="padding:16px 24px 28px;color:#64748b;font-size:13px;">
                <p style="margin:0 0 8px;">Thanks for joining —</p>
                <p style="margin:0 0 8px;">The Whale Enterprise Team</p>
                <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">
                Whale Enterprise • <a href="https://whaleenterprise.netlify.app/" style="color:#6b7280;text-decoration:underline;">whaleenterprise.netlify.app</a>
                </p>
            </td>
            </tr>

        </table>

        <!-- small note -->
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin-top:12px;">
            <tr>
            <td style="text-align:center;color:#9aa7bf;font-size:12px;">
                <p style="margin:0;">This is an automated message — please do not reply to this email.</p>
            </td>
            </tr>
        </table>

        </td>
    </tr>
    </table>
</body>
</html>
`
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });

        res.status(200).json({
            status: true,
            message : 'registered successfully' ,
            name : req.body.lastname,
            email: req.body.email,
            user: whaleDocument,
            accountNumber: whalesAccountDocument
        })

        
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status:false,
            message: 'Register Client ----- Registration Failed'
        })
    }
}




exports.SigninCustomer = async (req,res)=>{
    try{
        
        const {email, password } = req.body
    
        const user = await whalesModel.findOne({email: email})
            if(!user){
                console.log('findone failed');
                return res.json({
                    status: false,
                    message:'Timeout'
                })
            }

            let auth = bcrypt.compareSync(password, user.password)
                if(!auth){
                    console.log('password ---- error');
                    
                    return res.json({
                        status: false ,
                        message:'invalid credentials'
                    })
                }
            
                
                

                else{

                    const account = await whalesAccountModel.findOne({user:user._id})
                    console.log(account);
                    console.log(user);
                    
                    const token = jwt.sign({email:user.email},process.env.secret_key, {expiresIn:'1h'})  

                    return res.json({
                        status: true ,
                        message:'sign-in successful ',
                        token : token,
                        name:user.name  ,
                        user,
                        account
                    })
                }

            
    }
    catch(err){
                console.log(err);
                return res.status(500).json({message:'sigin ----- error'})
    }
}



exports.getDashboard =  (req,res)=>{
    let headers = req.headers.authorization

    if(!headers){
        return   res.status(400).json({
        status: false,
        message:'No token Provided'
        })
    }

    const token = headers.split(' ')[1] 
        jwt.verify(token ,"secretkey", (err, result)=>{
            if(err){
                console.log(err);
                res.json({
                    status:false,
                    message:'Token is expired or invalid'
                })
            }
            else{
                console.log(result);
                    let email = result.email
                        whalesModel.findOne({email:email})
                        .then((user)=>{
                            if (!user){
                                return res.json({
                                    status:false,
                                    message:'user dosent exist'
                                })
                            }

                            return res.json({
                                status:true,
                                message:' token is valid ',
                                user
                            })
                        })

                        .catch((err)=>{
                            console.log('error',err);
                            return res.status(500).json({
                                status:false,
                                message:'Server Error'
                            })
                            
                            })


                
            }
        })
}