const express = require ('express');
const bodyParser = require('body-parser');
var fs = require ('fs');
const requestMod = require('request');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var validator = require ('validator');
const { check, validationResult, body} = require('express-validator');

const router = express.Router()
const app = express();
app.route('/submitForm')
  .get(function(req, res) {
    fs.readFile("./public/createForm.html", "UTF-8", function(err, html) {
    res.writeHead(200,{"content-Type":"text/html"});  
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
                          responseHTML += '<button><a href="http://localhost:4000/submitForm">Back</a></button>';
                          response.send(responseHTML);
       
                    } 
               else{
                  // const data = JSON.stringify(request.body);
                  requestMod.post({url:'http://localhost:4001/submit1',
                    method :'POST', 
                    json :(request.body)
                  },
                  function (error, APIresponse, body) {
                    /* const data = JSON.stringify(request.body);
                    console.log(data);
                    response.send(data);

                    console.log(body); */
                    if (error) {
                      console.error(' failed:', error);
                      response.send(error);
                      console.log(error);
                 
                    }
                    console.log('Server responded with:', body);
                    response.send(body)
                  });
                
                }
              
            });

        

        app.listen(4000, () => {
          console.log("server is up on 4000");
        });
        

     
          