const express = require('express')
const { registerClient, SigninCustomer, getDashboard } = require('../controller/user.controller')
const { WhalesTransfer, Pin, tokenTransfer, getAllTransaction, getContact } = require('../controller/transfer.controller')
const { getRewards } = require('../controller/reward.controller')
const router = express.Router()


router.get('/sign', (req,res)=>{
    res.render('signin')
})

router.get('/transfer', (req,res)=>{
    res.render('transfer')
})
router.get('/pin', (req,res)=>{
    res.render('pin')
})

router.get('/sign-in', (req,res)=>{
    res.render('sign-in')
})


router.post('/transfer',WhalesTransfer)
router.post('/pin',Pin)

router.get("/dashboard", getDashboard);
// router.get('/account', tokenTransfer)

router.post('/register', registerClient)
router.post('/sign-in', SigninCustomer)

router.get('/transaction', getAllTransaction)
router.post('/feedback', getContact)

router.get('/rewards', getRewards)



module.exports = router
