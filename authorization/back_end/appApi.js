const express = require ('express');
const bodyParser = require('body-parser');
var fs = require ('fs');  
const { request } = require('http');
var httpStatus = require('http');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require ('mongodb').MongoClient;
var mongoDbURL = "mongodb://localhost:27017";
var dbName = 'hardi_test_db';
const url = 'http://localhost:3000/SubmitData';
const { check, validationResult, body, query} = require('express-validator');
const { json } = require('express');
const jwt = require ("jsonwebtoken");
const app = express();
const bcrypt = require('bcrypt');

app.use(bodyParser.json(request.body));
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/Login',urlencodedParser,function(req,res){
  MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
    if(err) {
      console.log("Got error");
        }
       try{
        const dbCollection = dbClient.db(dbName).collection('test_auth');
        var query ={Password: req.body.Password};
        console.log(query)
        var rounds = 10;
        bcrypt.hash(req.body.Password, rounds, (err, hash) => {
          console.log(req.body);
          req.body.Password = hash;
          console.log(req.body);
          dbCollection.findOne(req.body.Password, function(err,result) {
            console.log(result);
            if(err){throw err}
            else{
              jwt.sign({body:'req.body.demail'},"secretkey", function(err,token){
                   res.json({
                    token,
                });
            }); 
            }
          });          
  })
                
                 
      
        
        // res.writeHead(200, { 'Content-Type': 'text/json' });
        // res.end('{"statusCode" : 200, "message": "data is inserted"}');
    }    


// }
catch (err) {
  if (err) {
    console.log("Got error check below -");
    console.log(err);
    res.writeHead(500, { 'Content-Type': 'text/json' });
    res.end('{ "statusCode":500, "message" : "Internal Server Error"}');
    
  }
}

});
});
app.post('/api', urlencodedParser,[] ,function(request, res) {
    var errors = validationResult(request);
    
          MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
            if(err) {
              console.log("Got error");
                }
               try{
                const dbCollection = dbClient.db(dbName).collection('test_auth');
                    // const password = 'hardi123';
                        var rounds = 10;
                        
                        bcrypt.hash(request.body.Password, rounds, (err, hash) => {
                        console.log(request.body); 
                        request.body.Password = hash;
                         console.log(hash);
                         console.log(request.body);
                        dbCollection.insertOne(request.body, function(err,result) {
                          if(err)throw err;
                          /* else{
                            dbCollection.findOne(request.body.Password, function(err,result) {
                              console.log(result);
                              if(err){throw err}
                              else{
                                jwt.sign({body:'request.body.demail'},"secretkey", function(err,token){
                                     res.json({
                                      token,
                                  });
                              }); 
                              }
                            });
                          } */
                        });                        
                });
                res.writeHead(200, { 'Content-Type': 'text/json' });
                res.end('{"statusCode" : 200, "message": "data is inserted"}');
        }
        catch (err) {
          if (err) {
            console.log("Got error check below -");
            console.log(err);
            res.writeHead(500, { 'Content-Type': 'text/json' });
            res.end('{ "statusCode":500, "message" : "Internal Server Error"}');
            
          }
        }
        
    });
    
});


app.listen(3001, () => {
    console.log("server is up on 3001");
  });