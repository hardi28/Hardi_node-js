const express = require('express');
const router = express.Router();
const jwt = require ('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
// const Role = require('../models/role');
const db = 'mongodb://localhost/eventsdb';

mongoose.connect(db, { useNewUrlParser: true,useUnifiedTopology: true }, err =>{
    if(err){
        console.error('Error' +err);
    }
    else{
        console.log("Connected to MongoDb");
    }
})
function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }
  
router.post('/login',(req,res)=>{
    let userData = req.body;
     User.findOne({email: userData.email }, (error,user)=>{
        // if(user.role_id == '5fa3fd36a1af2d5a5800d0fd'){
            /* console.log("Hello");
         }else{ */
            if(error){
                console.log(error);
            }else{
            if(!user){
                res.status(401).send('invalid Email');
            }else{
                if(user.password !== userData.password){
                    res.status(401).send('invalid password');
                }else{
                  let payload = { subject: user._id }
                  let token = jwt.sign(payload, 'secretKey');
                    res.status(200).send({user});
                }
            }
        }
        // else{
        //     console.log("Enter valid mail_id");
        // }
    }); 
});
/* router.post('/create-user',verifyToken,(req,res)=>{
    res.send("enter")
}) */


module.exports = router;