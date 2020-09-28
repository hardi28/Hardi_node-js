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
// const check = express-validator.check({ StopValidationOnFirstError: true });
const { normalize } = require('path');
const { response } = require('express');
const { defaultMaxListeners } = require('stream');

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


 app.get ('/customForm', function(req, res) {
    fs.readFile("public/create.html", "UTF-8", function(err, html) {
        res.end(html);
    });
});


app.route ('/customForm')
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
         
          check('dnum', 'Minimum required length for number is 10').exists().isLength({min :10}).matches(/\d/).withMessage('must contain a number'),
          check('Password', 'Minimum required password for number is 5').isLength({min :5}),
          check('demail', 'Email should not be empty').not().isEmpty()
          .bail(),
          check('demail','email is not valid').normalizeEmail(),

         /*  check('demail')
          .isEmpty().withMessage('This is not a valid email'), */
         /*  check('demail').custom(function (email) {
            if (email == '') {
              // console.log(check('demail', 'Email should not be empty').not().isEmpty());
              check('demail', 'must be valid').normalizeEmail()
              console.log("Mail must be required")
              throw new Error('Mail must be required');
            }
            
          }), */
          
         
    ], function (request, response) {
      console.log(request.body)
      typeof request;
      console.log(typeof request);
      // var errors = validationResult(request);
      // console.log(errors);
      var errors = validationResult(request);
      // console.log(Object.keys(errors))
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

        /*  return response.json({
          errors:c
        }); */
        var responseHTML = '<!doctype><html><head><title>Errors</title></head><body>';
        c.forEach(function(validationError) {
          responseHTML += '<p>Error: '+validationError.msg+' in the field:'+validationError.param+'</p>';
        });
        responseHTML += '<button><a href="http://localhost:3003/customForm">Back</a></button>';
        response.send(responseHTML);
       
      }
      
     else  {
      // app.post('/customForm', function(req,res) {
      // var data ="";
      // req.on("data", function(chunk){
      //     data += chunk;
      //     console.log(data);
      // })
      // req.on("end", function(chunk){
          // console.log("data is valid");
          // response.send("Data is valid");
          MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
            if (err) {
                console.log("Got error");
                response.send("Error");
            }

            try {
                const dbCollection = dbClient.db(dbName).collection('form_data');
                /* console.log("Collection Object below");
                console.log(dbCollection);*/
                console.log(dbCollection.dbName); 
               /*  db.collection("form_data").insertMany(errors, function(err, res) {
                  if (err) throw err;
                  console.log("Number of documents inserted: " + res.insertedCount) */

                  dbCollection.insertOne(request.body, function(error, result) {
                    if (error) {
                        console.log("Got error");
                        response.send("Error");
                    }
                    /* console.log("This executes last");
                    console.log(result); // Result returned after execution of the query
                    console.log("data inserted sucessfully"); */
                    response.send("Data inserted successfully");
                    dbClient.close();
                  
                });
                console.log("This executes first");
            }
            catch (err) {
                if (err) {
                    console.log("Got error check below -");
                    console.log(err);
                    response.send("Error");
                    //throw err;
                }
              }
            });
    }

  });
       

  //     });
  //   }
  //     )}
  // }); 

app.listen(3003, () => {
  console.log("server is up on 3003");
});