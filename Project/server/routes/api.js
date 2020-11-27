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
// const userSchema = User.user;
// const userRole = User.role;
var randomstring = require("randomstring");
const db = 'mongodb://localhost/eventsdb';

router.use (cors());
var corsOptions ={
    origin :'*',
    optionsSuccessStatus: 200
}
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
router.post('/create-user',(req,res)=>{
        console.log(req.body);
        let userData = req.body;
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
                    tempUser.create({email:userData.email, random_token:random_token, topic: userData.topic ,is_used:0, is_expired:0} ,(error,user)=>{
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
                            // cc:'mansi.technotery@gmail.com',
                            subject:'Login please',
                            text:`http://localhost:5000/api/create-password?${tokenRandom}`
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
   
});

router.get('/create-password',cors(corsOptions),function(req,res){
    res.sendFile(path.join(__dirname + '/html/create-password.html'));
});


router.post('/create-password',(req,res)=>{ 
    console.log("HEYYYYYY"); 
    // tempUser.findOne({email:})
});

module.exports = router;
