require ("dotenv").config()
const express= require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require("passport")
const passportConfig = require("./config/passport")
const session = require("express-session")
const mongoStore = require("connect-mongo")
const errorHandler = require("./middlewares/errorHandler")
const methodOverride = require("method-override")

const userRoutes = require("./routes/authRoutes")
const postRoutes = require("./routes/postRoutes")
const commentRoutes = require("./routes/commentRoutes")


const PORT = process.env.PORT || 3000

//session middleware to managa session
app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  store: mongoStore.create({mongoUrl: process.env.MONGO_URL})
}))

//passport configuration
passportConfig(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))   //used for updating and deleting logic for posts

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}))
// app.use(express.json());

app.use("/auth", userRoutes)
app.use("/posts", postRoutes)
app.use("/", commentRoutes)

//error handler middleware
app.use(errorHandler)

app.get("/", (req, res)=>{
  res.render("home.ejs",{
    user:req.user,
    title:"Home",
    error:""
  })
})

mongoose.connect(process.env.MONGO_URL).then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`)
  })
}).catch((err)=>{
  console.log(err)
})

