const express = require('express');
const app = express();

//[parser is used to get the body values directly]
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//crypto
var crp = require('crypto')
var key ="password"
algo="aes256"



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
     data.save()
     .then((result)=>{res.status(201).json(result)})
     .catch((err)=>console.log(err))

 })

 

 console.log("put data send");
 app.listen(4000)