const express = require ('express');
const bodyParser = require('body-parser');
var fs = require ('fs');  
const { request } = require('http');
var httpStatus = require('http');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require ('mongodb').MongoClient;
// var objectId = require ('mongodb').ObjectID;
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
          res.writeHead(500, { 'Content-Type': 'text/json' });
          res.end('{ "statusCode":500, "message" : "Internal Server Error"}');
        }
        try {
          const dbCollection = dbClient.db(dbName).collection('user_mst');
          var query = { dname: request.body.dname};
          dbCollection.insert(query, function(error, result1) {
          if (error) {
                console.log("Got error");
                res.send("Error");
            }

          MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
            if(err) {
              console.log("Got error");
            }
               const dbCollection = dbClient.db(dbName).collection('user_dtls');
               var id =request.body.id;
               console.log(result1)
               console.log(result1.insertedIds[0]);
                // -------- FOR OBJECTID acces ------------
                // request.body.user_id = objectId();
                //     console.log(request.body);
                    request.body.user_id = (result1.insertedIds[0].toHexString());
                    console.log(request.body);
                dbCollection.insertOne(request.body, function(err,result) {
                    if(err)throw err;
                  //console.log(result)
                })
                res.writeHead(200, { 'Content-Type': 'text/json' });
                res.end('{"statusCode" : 200, "message": "data is inserted"}');
                // res.send(request.body);
                // });
                });

          });
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


app.post('/index',function(request, res) {
  MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
    if(err) {
      console.log("Got error");
      res.writeHead(500, { 'Content-Type': 'text/json' });
      res.end('{ "statusCode":500, "message" : "Internal Server Error"}');
    }
    var dataBaseName ='dbs';
    const dbCollection = dbClient.db(dataBaseName).collection('gadgests');
    dbCollection.findOne({"_id":4},function(err,result){
      console.log(result);
    });
  })
});

app.post('/sorting',function(request, res) {
  MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
    if(err) {
      console.log("Got error");
      res.writeHead(500, { 'Content-Type': 'text/json' });
      res.end('{ "statusCode":500, "message" : "Internal Server Error"}');
    }
    var dataBaseName ='dbs';
    const dbCollection = dbClient.db(dataBaseName).collection('gadgests');
    var sort = {gadget:1};
    dbCollection.find().sort(sort).toArray(function(err,result){
      if (err) throw err;
      console.log(result);
    });
  })
});
app.listen(3051, () => {
    console.log("server is up on 3051");
  });