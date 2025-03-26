const LocalStrategy = require("passport-local").Strategy
const User = require("../models/User")
const bcrypt = require("bcryptjs")

module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField:"username"}, async(username, password, done)=>{
    try{
      //find the user
      const user = await User.findOne({username})
      if(!user){
        return done(null , false , {
          message: "User Not Found with given Username"
        })
      }

      //compare the provided password with the one in database
      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch){
        return done(null , false , {
          message: "Incorrect Password"
        })
      }
      //authentication done , return the user object
      return done(null, user)
    }catch(err){
      return done(err)
    }
  }))

  //serialize user: Determines which data of the user object should be stored in the session, we store userId
  passport.serializeUser(function (user, done){
    done(null, user._id)
  })

  //desrialize the user object based upon the userId stored in the session
  passport.deserializeUser(async function(id, done){
    try{
      const user = await User.findById(id);
      done(null, user)
    }
    catch(err){
      done(err)
    }
  })

}