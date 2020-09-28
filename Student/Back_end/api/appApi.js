const express = require ('express');
const bodyParser = require('body-parser');
var fs = require ('fs');  
const { request } = require('http');
var httpStatus = require('http');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require ('mongodb').MongoClient;
var mongoDbURL = "mongodb://localhost:27017";
var dbName = 'hardi_test_db';
const url = 'http://localhost:5000/SubmitData';
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
          const dbCollection = dbClient.db(dbName).collection('UserDetails');
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
            
          }
        }
    
    });
});

app.post('/update',function(request,response){
MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
    if(err) {
      console.log("Got error");
      res.writeHead(500, { 'Content-Type': 'text/json' });
      res.end('{ "statusCode":500, "message" : "Internal Server Error"}');
    }
      const dbCollection = dbClient.db(dbName).collection('UserDetails');
        dbCollection.findOneAndUpdate({dname :/^Darshan/},{ $set:{demail:'darshanraval@gmail.com'} }, function(error, result) {
            if(error) throw error;
            console.log("Updated sucessfully");
            console.log(result);
      });
  })
});

app.post('/delete',function(request,response){
  MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
    if(err) {
      console.log("Got error");
      res.writeHead(500, { 'Content-Type': 'text/json' });
      res.end('{ "statusCode":500, "message" : "Internal Server Error"}');
    }
    const dbCollection = dbClient.db(dbName).collection('UserDetails');
    // --------------------------------------------REMOVE ANY ENTRY-------------------------------------------------------
    /*   dbCollection.remove({address :/^ahmedabad /}, function(error, result) {
            if(error) throw error;
            console.log("removed sucessfully");
            // console.log(result); */
            // ------------------------------------PRINT WHOLE COLLECTION--------------------------------------------------
            dbCollection.find({}).toArray(function(err, result) {
              if (err) throw err;{
              console.log(result);
              var responseHTML = '<!doctype><html><head><title>Errors<table><tr><th>name:</th> <th> number</th></tr></table></title></head><body>';
              result.forEach(function(resultData){
                responseHTML += '<p>'+ JSON.stringify(resultData) + '</p>';
                });
              response.send(responseHTML);
            }
          });

          //--------------------------------------FIND PARTICULAR FEILD-----------------------------------------------------
          dbCollection.find({dname:/hardi/}).toArray/* ).count( */(function(err, count) {
              if (err) throw err;{
              console.log(count);

              }
            });
      // });
  })
});
app.post('/join',function(request,response){
  MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
      if(err) {
        console.log("Got error");
      }
        const dbCollection = dbClient.db(dbName).collection('movie');
          dbCollection.aggregate([
              {
                $lookup:{
                  from : 'college',
                  localField :'city_code',
                  foreignField:'city_code',
                  as:'clg_info'
                }
              }
          ]).toArray(function(err,res){
            if(err) throw err;
            console.log(JSON.stringify(res));
          });
        });
    });

    
    app.post('/merge',function(request,response){
      MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
          if(err) {
            console.log("Got error");
          }
            const dbCollection = dbClient.db(dbName).collection('movie');
              dbCollection.aggregate([
                { $project: { _id: 0 } },
                {$merge : {into: "registration"}}
                
                  
              ]).toArray(function(err,res){
                if(err) throw err;
              });
              
            });
        });

app.listen(5001, () => {
    console.log("server is up on 5001");
  });