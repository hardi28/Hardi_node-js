const express = require ('express');
const bodyParser = require('body-parser');
var fs = require ('fs');  
const { request } = require('http');
// var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require ('mongodb').MongoClient;
var mongoDbURL = "mongodb://localhost:27017";
var dbName = 'hardi_test_db';
const url = 'http://localhost:4000/submitForm';
const app = express();

app.use(bodyParser.json(request.body));
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/submit1',function(request, res) {

    console.log("done...");
    MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
      if (err) {
        console.log("Got error");
        response.send("Error");
      }

          try {
          /* console.log("Collection Object below");
          console.log(dbCollection);*/
          console.log(typeof request.body);
          console.log(request.body);
            const dbCollection = dbClient.db(dbName).collection('application_data');
              dbCollection.insertOne(request.body, function(error, result) {
                // const data = JSON.stringify(request.body);
                // console.log(data);
                if (error) {
                  console.log("Got error");
                  res.send("Error");
                }
            
            
                res.send("Data inserted successfully");
                dbClient.close();
          
              });
          }
        catch (err) {
          if (err) {
            console.log("Got error check below -");
            console.log(err);
            res.send("Error");
            //throw err;
          }
          const dbCollection = dbClient.db(dbName).collection('application_data');
            dbCollection.find({}).toArray(function(err, result) {
              if (err) throw err;{
                console.log(result);
                var responseHTML = '<!doctype><html><head><title>Errors<table><tr><th>name:</th> <th> number</th></tr></table></title></head><body>';
                result.forEach(function(resultData){
                  responseHTML += '<p>'+ JSON.stringify(resultData) + '</p>';
                });
                // res.send(responseHTML);
              }
            });
        }
     
      
    
    }); 

        
})

  /* app.post(url,(error,req,response,body) => {
        console.log("Request received");
        console.log(body);
        // console.log(response);
        // res.send(data);
    }); */


  app.listen(4001, () => {
    console.log("server is up on 4001");
  });
//   module.exports = router