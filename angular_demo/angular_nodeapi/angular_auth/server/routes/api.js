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

router.get('/',(req,res)=>{
    res.send('from api route')
});
router.post('/register',(req,res)=>{
    let userData = req.body ;
    let user = new User(userData);
    user.save((error,registeredUser)=>{
        if(error){
            console.log(error);
        }else{
            res.status(200).send(registeredUser);
        }
    });
});
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
                    res.status(200).send(user);
                }
            }
        }
    });
});

module.exports = router;