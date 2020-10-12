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
const { json, response } = require('express');
const jwt = require ("jsonwebtoken");
const app = express();
const bcrypt = require('bcrypt');

app.use(bodyParser.json(request.body));
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/Login', urlencodedParser,function(req,response){
  MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
    if(err) {
      console.log("Got error");
        }
       try{ 
        const dbCollection = dbClient.db(dbName).collection('test_auth');
        var mail = {demail : req.body.demail}

          dbCollection.find(mail).toArray( function(err,result) {
            console.log(result[0])
              if (err){ 
               console.log(err)
              }
              else{
                bcrypt.compare(req.body.Password, result[0].Password, (err,res)=>{
                  // console.log(res);
                    if (res == false){
                      response.send("Enter valid password");
                    }
                    else{
                      jwt.sign({result},"secretkey",{ expiresIn: 60 * 60 },function(err,token){
                        response.json({
                          token,
                        });
                  
                }); 
                    }    
                  })
              }
            
            })              
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


// -----------------------------------------For Jwt verification route---------------------------------------------------------
app.post("/Login/post", verifyToken, function(req,res) {

  /* res.json({
    message: 'verified Json',
    // authData,
  }); */
});
// --------------------------------------------Function of token verification---------------------------------------------
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== "undefined"){
      const bearerToken = bearerHeader.split(" ")[1];
      // req.token = bearerToken;
      jwt.verify(bearerToken, "secretkey", function(err,authData){
      if (err){
          res.send(err); //forbidden
      }
      else{   
        res.send(authData);
        next();
      }
    });
  }
  else{
      res.sendStatus(403);
  }
}

app.listen(3001, () => {
    console.log("server is up on 3001");
  });

