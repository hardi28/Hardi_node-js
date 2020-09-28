const { response } = require('express');
let rawUrl = 'https://technotery.com/?dname=hardi&dnum=12345678910';

let parsedUrl = url.parse(rawUrl);
let parsedData = querystring.parse(parsedUrl.query);  
console.log(parsedData);     
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var querystring = require('querystring');


// querystring--------------------------------
// const { response } = require('express');
// let rawUrl = 'https://technotery.com/?dname=hardi&dnum=12345678910';

// let parsedUrl = url.parse(rawUrl);
// let parsedData = querystring.parse(parsedUrl.query);  
// console.log(parsedData);    


// ----------------some basics about database
/*  MongoClient.connect('mongodb://localhost:27017/hardi_test_db', function(err, db) {
    const dbCollection = dbClient.db(dbName).collection('form_data');
    var cursor = dbCollection.insertOne(req.query).find(query.filter);
    console.log(cursor); 
            
});*/