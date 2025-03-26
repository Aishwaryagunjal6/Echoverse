const User = require("../models/User")

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
  res.render("register")
}

exports.Register = async(req,res)=>{
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

}