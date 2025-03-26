const express= require('express')
const app = express()
const mongoose = require('mongoose')
require ("dotenv").config()

const userRoutes = require("./routes/authRoutes")

const PORT = process.env.PORT || 3000

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}))
// app.use(express.json());

app.use("/auth", userRoutes)

mongoose.connect(process.env.MONGO_URL).then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`)
  })
}).catch((err)=>{
  console.log(err)
})

