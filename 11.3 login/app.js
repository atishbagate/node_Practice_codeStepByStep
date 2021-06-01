const express = require('express');
const app = express();

//[parser is used to get the body values directly]
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//crypto
var crp = require('crypto')
var key ="password"
algo="aes256"

//we will use Json web token 
const jwt = require("jsonwebtoken");
jwtKey = "jwt";


const mongoose = require('mongoose');
const User = require('./models/users');

mongoose.connect("mongodb+srv://atish:0mu8ZbPjoTTQeii5@cluster0.avrwp.mongodb.net/tuto?retryWrites=true&w=majority",{ useNewUrlParser: true ,useUnifiedTopology: true})
.then( ()=>console.log("sucessfull connected.."))
 .catch((err)=>console.log(err));


 app.post('/register',jsonParser,function (req,res) {
     //to create password
     var cyp =crp.createCipher(algo,key);
     var encrypt = cyp.update(req.body.password,'utf-8','hex')
     +cyp.final('hex')
    

     //to send data to DB
     const data = new User({
         _id:mongoose.Types.ObjectId(),
         name:req.body.name,
         email:req.body.email,
         address: req.body.address,
         password: encrypt  //yaha per password encrypted middleware se ayega 
     })
     data.save().then((result)=>{
        jwt.sign({result},jwtKey,{expiresIn:'300s'},(err,token)=>{
            res.status(201).json({token})
        })
        
        // res.status(201).json(result)
    })
     .catch((err)=>console.log(err))

 })
 //to check only
// app.post('/login',jsonParser,function (req,res) {
//     User.findOne({email:req.body.email})
//     .then((data)=>{
//         res.json(data)
//     })    
// })
//real code with using token and password decryption
app.post('/login',jsonParser,function (req,res) {
    User.findOne({email:req.body.email})
    .then((data)=>{
        var decipher = crp.createDecipher(algo,key);
        var decrypt = decipher.update(data.password,'hex','utf-8')
        +decipher.final('utf-8');
        if(decrypt == req.body.password){
            jwt.sign({data},jwtKey,{expiresIn:'300s'},(err,token)=>{
                res.status(200).json({token})
            })
        }
    })    
})
 

 console.log("put data send");
 app.listen(4000)