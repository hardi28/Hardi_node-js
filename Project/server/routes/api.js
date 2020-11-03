const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const db = 'mongodb://localhost/eventsdb';

mongoose.connect(db, { useNewUrlParser: true,useUnifiedTopology: true }, err =>{
    if(err){
        console.error('Error' +err);
    }
    else{
        console.log("Connected to MongoDb");
    }
})
router.post('/login',(req,res)=>{
    let userData = req.body

     User.findOne({email: userData.email}, (error,user)=>{
        if(error){
            console.log(error);
        }else{
            if(!user){
                res.status(401).send('invalid Email');
            }else{
                if(user.password !== userData.password){
                    res.status(401).send('invalid password');
                }else{
                //   let payload = { subject: user._id }
                //   let token = jwt.sign(payload, 'secretKey')
                    res.status(200).send({user});
                }
            }
        }
    }); 
});

module.exports = router;