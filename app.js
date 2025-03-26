const express= require('express')
const app = express()
const mongoose = require('mongoose')
require ("dotenv").config()
const User = require("./models/User")

const PORT = process.env.PORT || 3000

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}))
// app.use(express.json());


app.get("/auth/login",(req,res)=>{
  res.render("login")
})

app.get("/auth/register",(req,res)=>{
  res.render("register")
})

app.post("/auth/register", async(req,res)=>{
  const {username, email, password} = req.body;
  try{
    //check if user exists
    const user = await User.findOne({email})
    if(user){
      res.send("User already exists")
    }
    else{
      //create user
      const newUser = new User({
        username,
        email,
        password
      })
      await newUser.save();

      res.redirect("/auth/login")
    }

  }catch(err){
    res.send(err)
  }

})

app.post("/auth/login",async (req, res)=>{
  const {username, password} = req.body;
  try{
    const user = await User.findOne({username})
    if(user && user.password===password){
      res.send("Login success")
    }
    else{
      res.send("login failed")
    }
  }catch(err){
    res.send(err)
  }
})

mongoose.connect(process.env.MONGO_URL).then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`)
  })
}).catch((err)=>{
  console.log(err)
})

