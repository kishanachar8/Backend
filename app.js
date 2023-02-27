const express = require('express');
const app=express(); 
const PORT=4000;
const cors = require('cors') //while sharing data from front and backend


//require database models
const User = require('./models/users')

const mongoose = require('mongoose');
mongoose.set('strictQuery',false);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cors());//cross origin resource sharing

const dbURL= "mongodb://localhost:27017/foodie"

mongoose.connect(dbURL).then(()=>{
    console.log("Connected to database");
})

app.post('/signup',async(req,res)=>{
    User.findOne({email:req.body.email}||{number:req.body.number},(err,userData)=>{
        if(userData){
            res.send({message:"User already exists"})
        }
        else{
            const data = new User({
                name:req.body.name,
                email:req.body.email,
                number:req.body.number,
                password:req.body.password,
            })
            try{
                data.save()
                res.send({message:'User registered successfully'})
            }
            catch(e){
                res.send(e)
            }
        }
    })
})

app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`);
})