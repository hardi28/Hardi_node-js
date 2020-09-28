const express = require('express');
const bodyParser = require('body-parser');
var fs = require ('fs');
const requestData = require('request');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var validator = require ('validator');
const { check, validationResult, body} = require('express-validator');
const { response } = require('express');
const { request } = require('http');
const app = express();

app.route('/SubmitData')
  .get(function(req, res) {
    fs.readFile("./UserDetails.html", "UTF-8", function(err, html) {
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
    
        check('dnum') 
        .matches(/\d/)
        .withMessage('must contain a number')
        .bail()
        .isLength({min :10})
        .withMessage('Minimum required length for number is 10'),       
        check('Password', 'Minimum 5 length is required')
        .isLength({min :5}),
        check('gender')
        .not()
        .isEmpty() 
        .withMessage('Specify your Gender'),
        check('address')
        .isLength({min : 30})
        .withMessage('Enter minimum 30 characters ')
        /* check('demail', 'Email should not be empty')
        .not()
        .isEmpty()
        .bail(), 
        check('demail','email is not valid')
        .normalizeEmail(), */
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
                  responseHTML += '<button><a href="http://localhost:5000/SubmitData">Back</a></button>';
                  response.send(responseHTML);

                } 
            else{
                console.log(request.body);
                requestData.post({url:'http://localhost:5001/api',
                    method :'POST', 
                    json :(request.body),
                },
                function (error, httpResponse, APIresponse) {
                    if (error) {
                        //console.error(' failed: data is incorrect', error);
                        //console.log(error);
                        response.writeHead(404, { 'Content-Type': 'text/json' });
                        response.end('{"statusCode" :404 , "message": "PAGE NOT FOUND"}');
                    }
                    // console.log(httpResponse);
                    console.log('Server responded with:', APIresponse);
                    response.send(APIresponse);
                });
                
            }
            
            
        });
        
        
        app.listen(5000, () => {
            console.log("server is up on 5000");
          });