const express= require('express')
const app = express()
const mongoose = require('mongoose')
require ("dotenv").config()

const PORT = process.env.PORT || 3000

app.set("view engine", "ejs");

app.get("/auth/login",(req,res)=>{
  res.render("login")
})

app.get("/auth/register",(req,res)=>{
  res.render("register")
})

mongoose.connect(process.env.MONGO_URL).then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`)
  })
}).catch((err)=>{
  console.log(err)
})

