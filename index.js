const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors());

const dotenv = require('dotenv')

dotenv.config()



app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const router = require('./routes/user.routes')
app.use('/user', router)

const port = process.env.port || 1000




// ejs

require('ejs')
app.set('view engine', 'ejs')

// mongoose
        const mongoose = require('mongoose')

        let uri = process.env.url
        
        mongoose.connect(uri)
        try{
            console.log('Mongodb connected Successfully');
            
        }
        catch(error){
            console.error('failed to connect to mongodb as usual',);
            
        }






app.listen(port,(req,res)=>{
    console.log(`Server Started at ${port}`);
    
})