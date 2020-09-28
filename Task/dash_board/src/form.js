const path =require ('path');
const express = require ('express');
var fs = require ('fs');

const bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var querystring = require('querystring');
var MongoClient = require ('mongodb').MongoClient;
var mongoDbURL = "mongodb://localhost:27017";
var dbName = 'hardi_test_db';

const app = express();

var validator = require ('validator');
const { check, validationResult} = require('express-validator');
app.route('/')
  .get(function(req, res) {
    fs.readFile("public/index.html", "UTF-8", function(err, html) {
      res.writeHead(200,{"content-Type":"text/html"});
      res.end(html);
  });
})
  .post(function(req, res) {
    res.send('login');
});

const url = require('url');
const { Router } = require('express'); 
 app.get ('/createForm2', function(req, res) {
    fs.readFile("public/create.html", "UTF-8", function(err, html) {
        res.end(html);
    });
});
// -------- QuerString data Pass into MongoDb----------
app.get('/createForm',function(req,res){
  var query = querystring.parse('')
  var query= req.query;
  console.log(query.dname);

  var form_data =req.get('form_data');
  MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
  const dbCollection = dbClient.db(dbName).collection('form_data');
  // dbCollection.find({}).toArray(function(err, result) { 
    // res.json({length: req.query});
  dbCollection.insertOne(req.query, function(error, result) {
    if (error) {
      console.log("Got error");
      response.send("Error");
    }
  console.log("Data Inserted");
  res.send(query);
  dbClient.close();                         
  });
});

});
// })

// ------- VALIDATION FORM THROUGH  EXPRESS-VALIDATOR------------------------
app.route ('/createForm1')
  .get(function(req, res) {
    fs.readFile("/public/create.html", "UTF-8", function(err, html) {
      res.end(html);
    });
  })
  .post(urlencodedParser, [
      check ('dname')
          .not()
          .isEmpty()
          .withMessage('name is not empty')
          .bail()
          .isAlpha()
          .withMessage('name allow only in alphabetical'),
         
          check('dnum', 'Minimum required length for number is 10')
          .exists()
          .isLength({min :10})
          .matches(/\d/)
          .withMessage('must contain a number'),

          check('Password', 'Minimum required password for number is 5')
          .isLength({min :5}),
          check('demail', 'Email should not be empty')
          .not()
          .isEmpty()
          .bail(),

          check('demail','email is not valid')
          .normalizeEmail(),
        ], function (request, response) {
            var errors = validationResult(request);
            if (errors.errors.length>0) {  
                var c = [];
                var errs = errors.array();
                for (var i = 0; i < errs.length; i++){
                  var tempObj ={
                    'msg' :errs[i].msg,
                    'param' :errs[i].param 
                  };
                  c.push(tempObj);
                }
              var responseHTML = '<!doctype><html><head><title>Errors</title></head><body>';
                c.forEach(function(validationError) {
                  responseHTML += '<p>Error: '+validationError.msg+' in the field:'+validationError.param+'</p>';
                    });
                      responseHTML += '<button><a href="http://localhost:3003/createForm">Back</a></button>';
                    response.send(responseHTML);
       
            }
      //------------------------ DATABASE CONNECTION FOR FORM DATA ENTRY------------------- 
    else  {
        MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
              if (err) {
                console.log("Got error");
                response.send("Error");
              } 

              try {
                    const dbCollection = dbClient.db(dbName).collection('form_data');
                      dbCollection.insertOne(request.body, function(error, result) {
                      if (error) {
                        console.log("Got error");
                        response.send("Error");
                      }
                    console.log("Data Inserted");
                    // response.send(result);
                    dbClient.close();                         
                    });
                }
              catch (err) {
                if (err) {
                    console.log("Got error check below -");
                    console.log(err);
                    response.send("Error");
                  }
              }
            
            const dbCollection = dbClient.db(dbName).collection('form_data');
           /*  var query ={ Password :String,
                          dname:String,
                          dnum:String,
                         demail:String}; */
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
              dbCollection.find({}).count(function(err, count) {
                  if (err) throw err;{
                   
                  console.log(count);
    
                  }
                });
               
        });
        
    }

});

app.listen(3003, () => {
    console.log("server is up on 3003");
  });