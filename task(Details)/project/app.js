let express = require('express');
let mongoose = require ('mongoose');
var MongoClient = require ('mongodb').MongoClient;
var mongoDbURL = "mongodb://localhost:27017/"
let app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get('/getContactDetails', (req, res, next) => {
    return new Promise ( async (resolve, reject) => {
        MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, async function(err, dbClient) {
            const contactTable = await dbClient.db("contacts").collection('contacts');

            contactTable.find({}).toArray(async function(er, contactdetails) {
                if (er) {
                    res.send({ message: "Internal server error", status: 500 });
                }
                else {
                    if (contactdetails.length> 0) {
                        return res.send({ data:contactdetails, message: "contact details fetched sucessfully", status: 200 });
                    }
                    else {
                        res.send({ data:contactdetails, message: "contact details fetched sucessfully", status: 200 })
                    }
                }
            });
        });
    });
});


contactNumber = ["+91 1234567890", "+911234567890","1234567890",
    "1234567890","+91 2345654323"]
    let phoneNumber , countryCode;
    let contactArr = [];
    contactNumber.forEach(ele =>{
        phoneNumber = ele;
        var regex = /([,\.\:!\+])/
        if (ele.match(regex)) {
            countryCode = phoneNumber.substring(0, 3);
            contactArr.push(phoneNumber.substring(3));
        }
        else {
            contactArr.push(ele);
        }
    });


app.post('/insertContact', (req, res, next) => {
    return new Promise ( async (resolve, reject) => {
        MongoClient.connect(mongoDbURL,  { useUnifiedTopology: true }, async function(err, dbClient) {
            const contactTable = await dbClient.db("contacts").collection('contacts');
            contactArr.forEach(element => {

                contactTable.find({"contact_no": element}).toArray(async function(er, contactdetails) {
                    if (er) {
                        res.send({ message: "Internal server error", status: 500 });
                    }
                    else {
                        if(contactdetails.length > 0) {
                            console.log({ message: "Contact number is already available", status: 500 });
                        }
                        else {
                            contactTable.insertOne({"contact_no" : element}, function (err, result) {
                                if (err) {
                                    console.log({ message: "Internal server error", status: 500 });
                                }
                                else{
                                   console.log({ message: "contact added sucessfully", status: 200 });
                                }
                            });
                        }
                    }
                });     
            });
            return res.send({ message: "contact added sucessfully", status: 200 });
        });
    });
});

app.listen(4250, ()=> {
    console.info("Starting port ==> ", 4250);
});