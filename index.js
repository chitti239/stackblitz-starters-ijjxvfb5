const express = require('express');
const { resolve } = require('path');
const mongoose = require("mongoose");
const User = require('./schema');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post("/api/users",async(req,res)=>{
  
  try {
    const {name,email,password} = req.body;
    if(!name || !email || !password){
      res.status(200).send("All fields are required")
    }
    const exist = await User.findOne({email});
    if(exist){
      res.status(200).send("User Already Exist");
    }
    const data = new User({name,email,password})
    await data.save(); 
    res.status(201).send("User created successfully")
  } catch (error) {
    res.status(500).send("Server error");
  }
})

app.listen(port, async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`Example app listening at http://localhost:${port}`);
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database");
  }
});
