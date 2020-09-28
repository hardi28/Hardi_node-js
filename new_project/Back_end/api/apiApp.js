const express = require ('express');
const bodyParser = require('body-parser');
var fs = require ('fs');  
const { request } = require('http');
var httpStatus = require('http');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require ('mongodb').MongoClient;
var mongoDbURL = "mongodb://localhost:27017";
var dbName = 'hardi_test_db';
const url = 'http://localhost:8000/SubmitData';
const { check, validationResult, body, query} = require('express-validator');
const app = express();

app.use(bodyParser.json(request.body));
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/api', urlencodedParser,[
  check('dname').not().isEmpty(),
  check('dnum').not().isEmpty(),
  check('Password').not().isEmpty(),
  check('demail').not().isEmpty()
  /*   .bail()
  .if(body('demail').exists())
  .custom((value,{req})=> value !== req.body.demail)
  .withMessage('emailid is already exists'), */
  
],function(request, res) {
      var errors = validationResult(request);
      console.log(errors);
      console.log(request.body);
        // ---------------------------------------FOR EMAIL BACKEND VALIDATION---------------------------------------------------
    MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient){ 
          const dbCollection = dbClient.db(dbName).collection('registration');
          console.log('just checking');
          var query = { demail: request.body.demail };
      dbCollection.findOne(query,/* ).toArray( */function(err, result) {
                // console.log(result)
                
                if (result !== null){
                  
                  res.writeHead(400, { 'Content-Type': 'text/json' });
                  res.end('{ "statusCode":400, "message" : "Email id is already taken"}');
                } 
            // ---------------------------------------FOR PASSWORD BACKEND VALIDATION-------------------------------------------------
          else if (!errors.isEmpty() )
          {   
              var errs =errors.array();
              var response = { "statusCode": 400, "message": {} };
              for (var i =0; i< errs.length; i++) {
                console.log('inside for loop');
                response.message[errs[i].param] = errs[i].msg;
              }    
        
              console.log(response);
              res.writeHead(400, { 'Content-Type': 'text/json' });
              res.end(JSON.stringify(response));
            }
      
               // -------------------------------------------DATABASE INSERTION---------------------------------------------------------------
          else {
            MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
              if(err) {
                console.log("Got error");
                res.writeHead(500, { 'Content-Type': 'text/json' });
                res.end('{ "statusCode":500, "message" : "Internal Server Error"}');
              }

              try {
                // console.log(request.body);
                const dbCollection = dbClient.db(dbName).collection('registration');
                dbCollection.insertOne(request.body, function(error, result) {
                if (error) {
                  console.log("Got error");
                  res.send("Error");
                }
                res.writeHead(200, { 'Content-Type': 'text/json' });
                res.end('{"statusCode" : 200, "message": "data is inserted"}');
                // res.send(request.body);

                });
              }
              catch (err) {
                if (err) {
                  console.log("Got error check below -");
                  console.log(err);
                  res.writeHead(500, { 'Content-Type': 'text/json' });
                  res.end('{ "statusCode":500, "message" : "Internal Server Error"}');
                  //throw err;
                }
              }
            });        
          }
      })
    });
});
/* var mongoose = require('mongoose')
const url = 'mongodb://localhost/hardi_test_db';
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


app.post('/mongooseRoute',function(req, res) {
  var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

mongoose.connect(url,{useNewUrlParser:true});
var db = mongoose.connection;
db.on('connected',function(){
  console.log('Connected......')
})
var UserSchema = new Schema({
  dname: {
    type :String,
    required :true 
  },
  Password:{
    type :String,
    required :true
  },
  
})
var query ={
  name : req.body.dname,
  email : req.body.demail
}
UserSchema.query.byName = function(name) {
  return this.where({ name: new RegExp(name, 'i') })
};


const UserModel = mongoose.model('UserModel',  UserSchema);
UserModel.find(query).exec((err,UserSchema ) => {
  console.log(UserSchema);
});

UserModel.findOne(query).exec((err, UserSchema) => {
  console.log(UserSchema);
});



}) */

app.listen(8001, () => {
    console.log("server is up on 8001");
  });