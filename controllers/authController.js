const User = require("../models/User")
const bcrypt = require("bcryptjs")

exports.getLogin = (req,res)=>{
  res.render("login")
};

exports.Login = async (req, res)=>{
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