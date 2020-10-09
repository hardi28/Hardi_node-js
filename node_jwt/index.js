const express = require ("express");
const jwt = require ("jsonwebtoken");

const app = express();

app.get("/api", function(req,res){
    res.json({
        message :"hey!!!"
    });
});

app.post('/api/posts',function(req,res){
    res.json({
        message: 'posting some value'
    });
});

app.post("/api/login", function(req,res){
    const user ={
        id:1,
        username: "hardi",
        email: 'hardi@gmail.com',
    };
    jwt.sign({user:user},"secretkey", function(err,token){
        res.json({
            token,
        });
    });
});


app.listen(3005, () => {
    console.log("server is up on 3005");
  });