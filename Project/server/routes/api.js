require('dotenv').config();
const express = require('express');
var dateFormat = require('dateformat');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require ('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
var path = require('path');
const User = require('../models/user');
const role = require('../models/role');
const tempUser = require('../models/temp-user');
const empLeave = require('../models/emp_leave');
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
const user = require('../models/user');
const { REPL_MODE_STRICT } = require('repl');
const { response } = require('express');
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
.withMessage('email can not be an empty field'),
/* .bail()
.isEmail()
.normalizeEmail()
.withMessage('Enter valid emailID'), */
check('password')
.not()
.isEmpty()
.withMessage('password can not be an empty field')

],(req,response)=>{
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
            response.send(emailError);
    }
    else{
    
        let userData = req.body;
        // console.log(userData);
        User.findOne({email: userData.email }, (error,user)=>{
            if(error){
                console.log(error);
            }
            else{
                if(!user){
                    response.status(401).json({data: "invalid Email"});
                }
                else{
                    console.log(user.password);
                    bcrypt.compare(userData.password,user.password, (err,res)=>{
                                console.log("Password Matched",res);
                            if(res == false){
                                response.status(401).json({password:'invalid password'});
                                // console.log("Enter password Again:")
                            }
                            else{
                                // console.log("asaasas");
                                let role_id ;
                                role.find({_id: user.role_id}, (err, role) => {
                                    console.log("err", role)
                                    if (err) {
                                        console.log(err);
                                    }
                                    
                                    else {
                                        role_id=role[0].id;
                                        console.log(role_id);
                                        let payload = { subject: user._id, role_id: role_id}
                                        let token = jwt.sign(payload, 'secretKey');
                                        response.status(200).send({token, role_id});  
                                    }
                                });
                            } 
                        })
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
    let role_id ={};
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
    User.findOne({email:userData.email},(err,respo)=>{
        // console.log("user table info",res);
        if (respo){
            res.status(400).send(respo);
            console.log("already in database:",respo);
        }
        else{
            tempUser.findOne({email:userData.email},(err,response)=>{
                if(!response){
                    if(userData.role === "employee"){
                    // role_id = 2;
                    console.log("role find");
                    console.log("hhhh",response)
                    res.status(200).send(response);
                        role.find({role_name : userData.role},(req,res)=> {
                            role_id = res[0]._id;
                            console.log(res);
                            //     })
                            // }
                            // else if(userData.role === "admin"){
                            //     role_id = 1;
                            // }
                            tempUser.create({email:userData.email, random_token:random_token, topic: userData.topic , role_id: role_id,is_used:0, is_expired:0 } ,(error,user)=>{ 
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
                                to:'hardi.technotery@gmail.com',
                                // to:userData.email,
                                subject:'Login please',
                                text:`http://localhost:4208/create-password/${tokenRandom}`
                                };

                                transporter.sendMail(mailOptions,function(err,response){
                                    if(err){
                                        console.log(err);
                                    }else{
                                    console.log("Email sent");
                                    }
                        
                                });
                            }
                            else{
                                res.status(400).send(error);
                                console.log("Error Occurs",error)
                            }
                        });
                        });
                    }
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
    let is_used = false;
    var currentTime = (new Date()).getTime() ;
    
     console.log("Currently date",currentTime);
     console.log("Token bind with url:", req.body);
     var id = req.body.id
     console.log(id);
     await tempUser.findOne({random_token:req.body.id},(req,res)=>{
            console.log("res.....",res);
            // console.log(res.createdAt);
            if(!res){
                is_invalid= true;
                console.log("Invalid Url");
            }
            else {
                if(res.is_used == true){
                    is_used = true;
                    // is_expired = true;
                    console.log("Used")
                }
                else{                
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
            }

        });
    res.status(400).json({is_invalid:is_invalid, is_expired:is_expired , is_used:is_used});
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
            let role_id ;

            if (userPassword.password == userPassword.confirm_password){
                res.status(200).json({done: "Password Created Sucessfully"});
                // console.log("Password Matched Sucessfully");
                tempUser.findOne({random_token: tokenId},(req,res)=>{
                    if(is_expired='true')
                    {
                        role_id = res.role_id;
                        email = res.email;
                        topic = res.topic;
                        password = userPassword.password,userPassword.confirm_password;
                        console.log(email, topic, tokenId, password, role_id);
                        const saltRounds = 10;
                        bcrypt.hash(userPassword.password, saltRounds, function(err, hash) {
                            console.log("password",hash);
                            // hash = password;

                            User.create({email:email,topic:topic,password:hash, role_id:role_id},(req,res)=>{
                            tempUser.updateOne({random_token:tokenId},
                                { $set: { 'is_used': 'true'}},((res,err)=>{
                                    console.log("url used");
                                    
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

router.post('/empleave',(req,res)=>{
    console.log("For leave",req.body);
    // var dateFormat = require('dateformat');
    var now = new Date();
    
    // console.log(date_format);
    var user_id = req.body.user_info.subject;
    var leaveReason = req.body.user.leaveReason;
    var leaveType = req.body.user.leaveType;
    var start = req.body.user.dateRange.start;
    var start_date = dateFormat(start, "fullDate");
    var end = req.body.user.dateRange.end ;
    var end_date = dateFormat(end, "fullDate");
    console.log(start_date, end_date);
    if(req.body.user.leaveReason == null && req.body.user.leaveType == null && (start == null || end == null) ){
        res.json({body:"Enter something!!!!!!!!!!!"});
    }
    else if(req.body.user.leaveReason == null){
        // console.log("Requiredddddd")
        res.json({reason:"Reason is required"});
    }
    else if(req.body.user.leaveType == null){
        res.json({leaveType:"Type is required"});
    }
    else{
        if(start == null || end == null){
            res.json({dateRange:"please enter date"});
        }
        else{
            User.find({_id : user_id },(req,res)=>{
                // console.log("user Id role...",res[0]._id);
                user_id = res[0].id;
                empLeave.create({leaveReason: leaveReason ,leaveType: leaveType,startDate: start , endDate:end , is_approved:0, user_id: user_id } ,(req,res)=>{ 
                    console.log("Leave added", res);
                });
            });
        }
    }
    
    
});

router.post('/create-admin',(req,res)=>{
    const saltRounds = 10;
    var password;
    bcrypt.hash("vedang@gmail.com", saltRounds, function(err, hash) {
        console.log("password",hash);
        password = hash;
        email= "vedang@gmail.com";
        role_name ="admin";
        role.find({role_name: role_name}, (err, role) => {
            console.log("err", role)
            if (err) {
                console.log(err);
            }
            
            else {
                role_id=role[0].id;
                console.log(role[0]._id);
                let payload = { subject: user._id, role_id: role_id}
                let token = jwt.sign(payload, 'secretKey');
                User.create({email:email, password:hash, role_id:role[0]._id},(req,res)=>{
                    console.log(res);
                })
                // res.status(200).send({token, role_id});  
            }  
        });
    
    });

});

router.get('/view-all-leave',(req,response)=>{
    var user_id = req.query.user_id;
    console.log("req", req.query.user_id);
    empLeave.find({user_id :String(user_id)} ,(req,res)=>{
        console.log("dddd",res);
        response.send(res);
    });

});

router.get('/admin-view-leave',(req,response)=>{
    console.log("for admin view leave",req.query);
    var now = new Date().getTime();
    
        empLeave.find({is_approved:false},(req,res)=>{

            let leave_response = res.filter((leave_obj) => {
                let start_date = new Date(leave_obj.startDate).getTime();
                if(start_date >= now){
                    return leave_obj;// console.log("for admin leave" ,start_date, now);
                }
            })
            response.send(leave_response);
          
        });  

});
router.post('/admin-update-leave',(req,response)=>{
    console.log("admin update leave",req.body);
    // console.log("admin update leave");
    empLeave.find({_id:req.body.leaveId},(req,res)=>{
        console.log(res);
        console.log("find leave here");
        
        empLeave.updateOne(res[0],
            { $set: { 'is_approved': 'true'}},((res, err)=>{
                console.log("update flag");
                console.log(res);
            })
        );
        console.log("Last");
        console.log(res[0].id);
        if(res[0]){ 
            empLeave.find({_id:res[0].id},(req,res)=>{
                console.log("res",res);
                var leaveId = res[0].user_id;
                var leaveType = res[0].user_leaveType;
                User.findOne({_id:leaveId},(req,user)=>{
                    console.log("userrrrr",user);
                    let transporter = nodemailer.createTransport({
                        service:'gmail',
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD
                        }
                    });
                    let mailOptions ={
                    from:'hardi.technotery@gmail.com',
                    to : user.email,
                    subject:'Do not reply!!!!',
                    text: "leaveType",
                    };
            
                    transporter.sendMail(mailOptions,function(err,res){
                        if(err){
                            console.log(err);
                        }else{
                        console.log("Email sent");
                        }
                
                    });  
                })
            })

        }
        response.send(res);
    });
});

module.exports = router;
