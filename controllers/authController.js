const User = require("../models/User")
const bcrypt = require("bcryptjs")
const passport = require("passport")

exports.getLogin = (req,res)=>{
  res.render("login")
};

exports.Login = async (req, res, next)=>{
  passport.authenticate("local", (err, user, info)=>{
    if(err){
      return next(err)
    }
    if(!user){
      return res.render("login", {
        title: "Login",
        user: req.username,
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
}

exports.getRegister = (req,res)=>{
  res.render("register", { title: "Register", user: req.username, error: null });
}

exports.Register = async(req,res)=>{
  const {username, email, password} = req.body;
  try{
    //if user exists already
    const existingUser = await User.findOne({username})
    if(existingUser){
      return res.render("register", {
        title: "Register",
        user: req.username,
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
      user: req.username,
      error: error.message
    })
  }

}