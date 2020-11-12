require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require ('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const bodyParser = require('body-parser');
const userSchema = User.user;
const userRole = User.role;
var randomstring = require("randomstring");
const db = 'mongodb://localhost/eventsdb';

const { check, validationResult} = require('express-validator');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
let mailOptions ={
    from:'hardi.technotery@gmail.com',
    to:'hardi.technotery@gmail.com',
    // cc:'mansi.technotery@gmail.com',
    subject:'ohhh hello',
    text:'www.google.com'
};

transporter.sendMail(mailOptions,function(err,res){
    if(err){
        console.log(err);
    }else{
        // console.log("Email sent");
    }
     
});
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
.bail(),
check('email','enter proper mailId')
.normalizeEmail(),
check('password')
.not()
.isEmpty()
.withMessage('password can not be an empty field')

],(req,res)=>{
    var errors = validationResult(req);
    console.log(errors)
    if (errors.errors.length>0) {  
        var c =[];
        var errs = errors.array();
        for (var i = 0; i < errs.length; i++){
            var tempObj ={
              'msg' :errs[i].msg,
              'param' :errs[i].param 
            };
            c.push(tempObj);
            // console.log(c);
        }
       
            c.forEach(function(validationError) {
                var responseHTML = '<!doctype><html><head><title>Errors<table><tr><th>name:</th> <th> number</th></tr></table></title></head><body>';
                responseHTML += '<p>'+ JSON.stringify(validationError) + '</p>';    
                // res.json(validationError);
                    
            });
    }
    else{
    
    let userData = req.body;
    userSchema.findOne({email: userData.email }, (error,user)=>{
        // if(user.role_id == '5fa3fd36a1af2d5a5800d0fd'){
            /* console.log("Hello");
         }else{ */
            if(error){
                console.log(error);
            }else{
            if(!user){
                // res.status(401).json({"data": "invalid Email"});
            }else{
                if(user.password !== userData.password){
                    res.status(401).send('invalid password');
                }else{
                    userRole.findOne({role_id: user.role_id}, (err, role) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(role);
                        }
                    });
                    let payload = { subject: user._id }
                    let token = jwt.sign(payload, 'secretKey');
                    res.status(200).send({token});
                }
            }
        }
        // else{
        //     console.log("Enter valid mail_id");
        // }

    }); 
}
});
router.post('/create-user',(req,res)=>{
        console.log(req.body);
        let userData = req.body;
        userSchema.findOne({email:userData.email} ,(error,user)=>{
            
            if(error){
                console.log(error);
            }else{
                if( userData.email == user.email  ){
                    console.log("already Enter into Db")
                }else{
                console.log(user);
                let random_token = randomstring.generate();
                res.status(200).send({random_token});
                }
              }
        });
   
});


module.exports = router;