const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const passport = require("passport")

exports.getLogin = asyncHandler((req,res)=>{
  res.render("login",{
    title:"Login",
    error:"",
    user: req.user
  })
})

exports.Login = asyncHandler(async (req, res, next)=>{
  passport.authenticate("local", (err, user, info)=>{
    if(err){
      return next(err)
    }
    if(!user){
      return res.render("login", {
        title: "Login",
        user: req.user,
        error: info.message
      })
    }
    req.logIn(user, (err)=>{
      if(err){
        return next(err)
      }
      return res.redirect("/")
    })
  })(req, res, next)
})

exports.getRegister = asyncHandler((req,res)=>{
  res.render("register", { title: "Register", user: req.user, error: null });
})

exports.Register = asyncHandler(async(req,res)=>{
  const {username, email, password} = req.body;
  try{
    //if user exists already
    const existingUser = await User.findOne({username})
    if(existingUser){
      return res.render("register", {
        title: "Register",
        user: req.user,
        error: "User already Exists"
      })
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    //create user
    const user = await User.create({
      username,
      email,
      password:hashedPassword
    })

    res.redirect("/auth/login")
  }catch(error){
    res.render("register",{
      title:"Register",
      user: req.user,
      error: error.message
    })
  }

}
)


exports.logout = asyncHandler((req, res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    res.redirect("/auth/login")
  })
})