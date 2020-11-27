const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');
// var path = require('path');
const PORT = 5000;
const api = require('./routes/api')
const app = express()

app.use (cors());
app.use(bodyParser.json());
app.use('/api',api);
app.get('/',function(req,res){
    res.send('Hello!!!!!!!!!!!!!');
});

// app.get('/create-password',cors(corsOptions),function(req,res){
//     res.sendFile(path.join(__dirname + '/routes/html/create-password.html'));
// });
app.listen(PORT,function(){
    console.log('server running on localhost:'+PORT);
});