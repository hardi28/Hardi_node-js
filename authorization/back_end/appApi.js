const express = require ('express');
const bodyParser = require('body-parser');
var fs = require ('fs');  
const { request } = require('http');
var httpStatus = require('http');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require ('mongodb').MongoClient;
var mongoDbURL = "mongodb://localhost:27017";
var dbName = 'hardi_test_db';
const url = 'http://localhost:3050/SubmitData';
const { check, validationResult, body, query} = require('express-validator');
const app = express();

app.use(bodyParser.json(request.body));
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/api', urlencodedParser,[] ,function(request, res) {
    var errors = validationResult(request);
    
          MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
            if(err) {
              console.log("Got error");
                }
               try{
                const dbCollection = dbClient.db(dbName).collection('test_auth');
                var query ={Password: request.body.Password};
                console.log(query)
                
                    const bcrypt = require('bcrypt');
                    // const password = 'hardi123';
                        var rounds = 10;
                        
                       bcrypt.hash(request.body.Password, rounds, (err, hash) => {
                        dbCollection.insertOne(hash, function(err,result) {
                          if(err)throw err;
                        })
                         console.log(hash);
                        
                })
                res.writeHead(200, { 'Content-Type': 'text/json' });
                res.end('{"statusCode" : 200, "message": "data is inserted"}');
                // res.send(request.body);
                // });
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


app.listen(3001, () => {
    console.log("server is up on 3001");
  });