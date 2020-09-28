const express = require('express');
const request = require('request');
var http = require ('http');
var  fs = require('fs');
const bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();

// app.use(express.json());
// const { body, validationResult } = require('express-validator');

var validator = require ('validator');
const { check , validationResult} = require('express-validator');
app.set('view engine', 'jade');


/* 
app.post('/forms',  [
    // body('demail').isEmail(),
    
    // body('dname').isLength({ min: 7 }),
    // body('dnum').isLength({ min: 7 })
    check('dname','this is invalid')
        .exists()
        .isLength({min :5}),
    check('demail','this mail is not valid')
        .isEmail()
        .normalizeEmail()
  ], (req, res) => {
    

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array() });
    const alret = errors.array()
    res.render('indexfile' , {
        "Error": "This is an error",
    });
      
 } */
    // else {
    //     res.send("Data is valid");
    // }
    
    /*  user.create({
        dname: req.body.dname,
        dnum: req.body.dnum
      }).then(user => res.json(user)); */
    // }); 
//   });
    

    /* app.post('/forms', body().isEmail(), (req, res) => {
      // Assume the validity of the request was already checked
      User.recoverPassword(req.body).then(() => {
        res.send('Password recovered!');
      });
    }); */



app.route ('/form'/*,  [
    body('demail').isEmail()
  ] */)
   .get(function( req, res ){
    fs.readFile("../public/indexfile.html","UTF-8",function(err,html){
        res.writeHead(200,{"content-Type":"text/html"});
        res.end(html);
        console.log('get method run');
        })
       
    })
    
    .post(function ( req , res) {
        //Nodejs way of reading a form data in POST method
        var data ="";
        req.on("data", function(chunk) {
            data += chunk;
            console.log(data);
        })
        req.on("end", function(chunk) {
            res.set('Content-Type', 'text/html');
            res.status(200).send(data);
        });
        console.log("post method run");
    }); 
    

    app.route ('/customForm')
       .get(function(req, res){
        fs.readFile("../public/form.html", "UTF-8", function(err,html){
            res.writeHead(200,{"content-Type":"text/html"});
            res.end(html);
            console.log('get method run');
            })
        })
        .post(urlencodedParser, [
            check ('dname')
                .not()
                .isEmpty()
                .withMessage('name is required'),
                check('dname', 'Erorr message for Name').exists().isLength({min :5}),
                check('dname', 'Username is required').notEmpty(),
                check('demail','Erorr message for Email').isEmail().normalizeEmail()
         ], function (request, response) {
            console.log("Inside POST");
            console.log(request.body);
            var errors = validationResult(request);
            if (errors) {
                console.log("First");
                console.log(errors);
                console.log("Second");
                console.log(errors.array());
                return response.status(422).json({ 
                    errors: errors.array() 
            });
            } else {
                response.send("Data is valid");
            }
        });

app.listen(3002, ()=>{
    console.log("Server is up on 3002");
});