require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require ('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
var path = require('path');
const User = require('../models/user');
const role = require('../models/role');
const tempUser = require('../models/temp-user')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
// const userSchema = User.user;
// const userRole = User.role;
var randomstring = require("randomstring");
const db = 'mongodb://localhost/eventsdb';

router.use (cors());
/* var corsOptions ={
    origin :'*',
    optionsSuccessStatus: 200
} */
const { check, validationResult} = require('express-validator');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

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
  
router.post('/login',urlencodedParser,[check('email')
.not()
.isEmpty()
.withMessage('email can not be an empty field')
.bail()
.isEmail()
.normalizeEmail()
.withMessage('Enter valid emailID'),
check('password')
.not()
.isEmpty()
.withMessage('password can not be an empty field')

],(req,res)=>{
    var emailError = "";
    var errors = validationResult(req);
    // console.log(errors)
    if (errors.errors.length>0) {  
        var c =[];
        // var tempObj={};
        var errs = errors.array();
        for (var i = 0; i < errs.length; i++){
            var tempObj ={
              'msg' :errs[i].msg,
              'param' :errs[i].param 
            };
            if(errs[i].param === "password" && c.length === 0){
                c.push("");
            }
            c.push(tempObj.msg);
            
        }
        if(c.length !== 2){
            c.push("");
        }
        console.log(tempObj);
        // console.log(c);
        emailError = c;
            emailError = JSON.stringify(emailError);
            console.log(emailError);
            res.send(emailError);
    }
    else{
    
        let userData = req.body;
        User.findOne({email: userData.email }, (error,user)=>{
            if(error){
                console.log(error);
            }
            else{
                if(!user){
                    // res.status(401).json({"data": "invalid Email"});
                }
                else{
                    if(user.password !== userData.password){
                        res.status(401).send('invalid password');
                    }else{
                        let role_id ;
                        role.find({_id: user.role_id}, (err, role) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                role_id=role[0].id;
                                console.log(role_id);
                                let payload = { subject: user._id, role_id: role_id}
                                let token = jwt.sign(payload, 'secretKey');
                                res.status(200).send({token, role_id});
                                
                            }
                        });
                    }
                }
            }
        
        }); 
    }
});
router.post('/create-user',urlencodedParser,[check('email')
.not()
.isEmpty()
.withMessage('email can not be an empty field')],(req,res)=>{
    let userData = req.body;
    var emailError = "";
    var errors = validationResult(req);
    // console.log(errors)
    if (errors.errors.length>0) {  
        var c =[];
        // var tempObj={};
        var errs = errors.array();
        for (var i = 0; i < errs.length; i++){
            var tempObj ={
              'msg' :errs[i].msg,
              'param' :errs[i].param 
            };
            c.push(tempObj.msg);
            
        }
        if(c.length !== 2){
            c.push("");
        }
        console.log(tempObj);
        // console.log(c);
        emailError = c;
            emailError = JSON.stringify(emailError);
            console.log(emailError);
            res.send(emailError);
    }
    else{
        console.log("req body",req.body);
        let random_token = randomstring.generate({
            // length: 12,
          });
    //-------------------------------- Add users by admin into tempCollection---------------------------
    User.findOne({email:userData.email},(err,res)=>{
        // console.log("user table info",res);
        if (res){
            console.log("already in database:",res);
        }
        else{
            tempUser.findOne({email:userData.email},(err,res)=>{
                if(!res){
                    tempUser.create({email:userData.email, random_token:random_token, topic: userData.topic , role: userData.role,is_used:0, is_expired:0 } ,(error,user)=>{ 
                        console.log("user" ,user.random_token);
                        if (user){
                            let transporter = nodemailer.createTransport({
                                service:'gmail',
                                auth: {
                                    user: process.env.EMAIL,
                                    pass: process.env.PASSWORD
                                }
                            });
                            var tokenRandom = user.random_token;
                            let mailOptions ={
                            from:'hardi.technotery@gmail.com',
                            to:userData.email,
                            subject:'Login please',
                            text:`http://localhost:4208/create-password/${tokenRandom}`
                            };
                    
                            transporter.sendMail(mailOptions,function(err,res){
                                if(err){
                                    console.log(err);
                                }else{
                                console.log("Email sent");
                                }
                        
                            });
                        }
                        else{
                            console.log("Error Occurs",error)
                        }
                    });
                }
                else{
                    console.log("Already in database");
                }
                });
            }   
    });
    }
});

router.post('/random-token',async(req,res)=>{
    let is_invalid = false;
    let is_expired = false;
    var currentTime = (new Date()).getTime() ;
    
     console.log("Currently date",currentTime);
     console.log("Token bind with url:", req.body);
     var id = req.body.id
     await tempUser.findOne({random_token:req.body.id},(req,res)=>{
            console.log("res.....",res);
            // console.log(res.createdAt);
            if(!res){
                is_invalid= true;
                console.log("Invalid Url");
            }
            else {
                var tokenCreationTime = new Date (res.createdAt);
                var tokenExpiryTime = (new Date (res.createdAt)).getTime() + 86400000;
                console.log(tokenExpiryTime);
                if(currentTime > tokenExpiryTime){
                    is_expired =true;
                    tempUser.updateOne({random_token:id},
                    { $set: { 'is_expired': 'true'}},((res,err)=>{
                            console.log(res);
                        })        
             
                    )   
                    console.log("URL expired");
                }
            }
        });
    res.status(400).json({is_invalid:is_invalid, is_expired:is_expired});
    // }
});

router.post('/create-password',(req,res)=>{ 
    console.log("HEYYYYYY",req.body); 
    var tokenId = req.body.randomToken.id;
    var userPassword = req.body.userModel;
    let is_used = false;
    console.log(userPassword);  
    if(!userPassword.password && !userPassword.confirm_password){
        res.status(200).json({all:"Please enter Something"});
        console.log("Please enter password");
    }    
    else{
        if (!userPassword.password){
            res.status(200).json({pass: "Please enter Password field"});
            console.log("Please enter Password field");
        }
        else if(!userPassword.confirm_password){
            res.status(200).json({confirm_password: "Please enter Confirm Password"});
            console.log("Please enter Confirm Password field");
        }
        else if (userPassword.password != userPassword.confirm_password){
            res.status(200).json({all: "Password did not Matched "});
            console.log("Password did not Matched ");
        }
        else{
            let email = "";
            let topic = "";

            if (userPassword.password == userPassword.confirm_password){
                res.status(200).json({done: "Password Created Sucessfully"});
                // console.log("Password Matched Sucessfully");
                tempUser.findOne({random_token: tokenId},(req,res)=>{
                    if(is_expired='true')
                    {
                        email = res.email;
                        topic = res.topic;
                        password = userPassword.password,userPassword.confirm_password;
                        console.log(email, topic, tokenId, password);
                        const saltRounds = 10;
                        bcrypt.hash(userPassword.password, saltRounds, function(err, hash) {
                            console.log("passwordf.mlvfmdkfsnfcsjkdhfjksdhfvjsd",hash);
                            // hash = password;
                            User.create({email:email,topic:topic,password:hash},(req,res)=>{
                            tempUser.updateOne({random_token:tokenId},
                                { $set: { 'is_used': 'true'}},((res,err)=>{
                                    res.status(200).json({is_used:is_used});
                                    
                                })
                                ) 
                            }); 
                        }); 
                    }
                
                });
            }
            else{

            }
        } 
        
    }
    
    
});

module.exports = router;
