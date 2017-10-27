import passport from 'passport'
import User from '../models/user'
import config from '../config'

//token验证模块
const Strategy = require('passport-http-bearer').Strategy

module.exports = function(passport){
  passport.use(new Strategy(
    function(token,done){
      User.findOne({token:token},function(err,user){
        if(err) return done(err);
        if(!user) return done(null,false);
        return done(null,user)  
      })
    }
  ))
}
