const express = require ("express");
const jwt = require ("jsonwebtoken");

const app = express();

app.get("/api", function(req,res){
    res.json({
        message :"hey!!!"
    });
});

app.post("/api/posts",verifyToken,function(req,res){
    jwt.verify(req.token, "secretkey", function(err,authData){
        if (err){
            res.sendStatus(403); //forbidden
        }else{
            res.json({
                message: 'posting some value',
                authData,
            });
        }
    });
});


app.post("/api/login", function(req,res){
    const user ={
        id:1,
        username: "hardi",
        email: 'hardi@gmail.com',
    };
    jwt.sign({user},"secretkey", function(err,token){
        res.json({
            token,
        });
    });
});

function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== "undefined"){
        const bearerToken = bearerHeader.split("")[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}
app.listen(3005, () => {
    console.log("server is up on 3005");
  });