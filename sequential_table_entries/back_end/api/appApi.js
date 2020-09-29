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

var session =require ('express-session');
var session =require ('session');


// ------------------------------------------------------ TRANSACTION INTO TABLES-------------------------------------------------------------

// app.post('/transaction' ,function(request,res) {
    
//    MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
    
//     var dataBaseName ='test';
//     var dbCollection = dbClient.db(dataBaseName).collection('accounts');
//     dbCollection.insert([
//       { _id: "har", balance: 500, pendingTransactions: [] },
//       { _id: "dave", balance:500, pendingTransactions: [] }
      
//     ], function(error, result) {
//       if (result == 0) {
//         console.log(result);
//             const dbCollectTransaction = dbClient.db(dataBaseName).collection('transactions');
//               dbCollectTransaction.insert(
//                 { _id: 4 , source: "har", destination: "dave", value:200, state: "initial", lastModified: new Date() }
//             )
          
//         }
//         else {
//           const dbCollectTransaction = dbClient.db(dataBaseName).collection('transactions');
//           var t = dbCollectTransaction.findOne( { state: "initial" } );
//           //  console.log(t)
//             dbCollectTransaction.updateOne(
//             { _id: 4, state: "initial" },
//             {
//               $set: { state: "pending" },
//               $currentDate: { lastModified: true }
//             }
//           )
//         }
        
        
//           dbCollection.updateOne(
//             { _id: "har", pendingTransactions: { $ne: t._id } },
//             { $inc: { balance: -200}, $push: { pendingTransactions: t._id } }
//             )
//              dbCollection.updateOne(
//               { _id: "dave", pendingTransactions: { $ne: t._id } },
//               { $inc: { balance: t.value }, $push: { pendingTransactions: t._id } }
//            )
           
//            const dbCollectTransaction = dbClient.db(dataBaseName).collection('transactions');

//         dbCollectTransaction.update(
//         { _id: 4, state: "pending" },
//         {
//           $set: { state: "applied" },
//           $currentDate: { lastModified: true }
//         }
//      )
//       });
      
      
  
//   });
  
//   });

app.post('/transaction' ,function(request,res) {
  MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, function(err, dbClient) {
    var dataBaseName ='test';
    var dbCollection = dbClient.db(dataBaseName).collection('accounts');
    dbCollection.insert([
            { _id:5, name: "hh", balance: 500, pendingTransactions: [] },
            { _id:6,name: "dd", balance:500, pendingTransactions: [] }
            
            ] )/* , function(error, result){ */
          var dataBaseName ='test';
          var dbCollection = dbClient.db(dataBaseName).collection('dbCollection');
        const dbCollectTransaction = dbClient.db(dataBaseName).collection('transactions');
    function cancel(id) {
      dbCollectTransaction.updateOne(
        { _id: id }, 
        { $set: { state: "canceled" } }
      );
      }

  function rollback(from, to,value, id) {
    // Reverse debit
    dbCollection.updateOne({
      name: from, 
      pendingTransactions: { $in: [id] }
    }, {
      $inc: { balance: value }, 
      $pull: { pendingTransactions: id }
    });  

   // Reverse credit
    dbCollection.updateOne({
      name: to, 
      pendingTransactions: { $in: [id] }
    }, {
      $inc: { balance: -value }, 
      $pull: { pendingTransactions: id }
    });  

    cancel(id);
  }

function cleanup(from, to, id) {
  // Remove the transaction ids
  dbCollection.updateOne(
    { name: from }, 
    { $pull: { pendingTransactions: id } });
  
  // Remove the transaction ids
  dbCollection.updateOne(
    { name: to }, 
    { $pull: { pendingTransactions: id } });

  // Update transaction to committed
  dbCollectTransaction.updateOne(
    { _id: id }, 
    { $set: { state: "done" } });
}

function executeTransaction(from, to, value) {
  var objectId = require ('mongodb').ObjectID;
  var transactionId =objectId();

  dbCollectTransaction.insert({
    _id:  transactionId , 
    source: from, 
    destination: to, 
    value: value, 
    state: "initial"
  });

  var result = dbCollectTransaction.updateOne(
    { _id: transactionId }, 
    { $set: { state: "pending" } }
  );

  if (result.modifiedCount == 0) {
    cancel(transactionId);
    throw Error("Failed to move transaction " + transactionId + " to pending");
  }

    // Set up pending debit
    result = dbCollection.updateOne({
      name: from, 
      pendingTransactions: { $ne: transactionId }, 
      balance: { $gte: value }
    }, {
      $inc: { balance: -value }, 
      $push: { pendingTransactions: transactionId }
    });

  if (result.modifiedCount == 0) {
    rollback(from, to, value, transactionId);
    throw Error("Failed to debit " + from + " account");
  }

  // Setup pending credit
  result = dbCollection.updateOne({
    name: to, 
    pendingTransactions: { $ne: transactionId }
  }, {
    $inc: { balance: value }, 
    $push: { pendingTransactions: transactionId }
  });

  if (result.modifiedCount == 0) {
    rollback(from, to, value, transactionId);
    throw Error("Failed to credit " + to + " account");
  }

  // Update transaction to committed
  result = dbCollectTransaction.updateOne(
    { _id: transactionId }, 
    { $set: { state: "committed" } }
  );

  if (result.modifiedCount == 0) {
    rollback(from, to, value, transactionId);
    throw Error("Failed to move transaction " + transactionId + " to committed");
  }

  // Attempt cleanup
  cleanup(from, to, transactionId);
}

executeTransaction("hh", "dd", 200);
})
  // });

});
app.listen(3051, () => {
    console.log("server is up on 3051");
  });