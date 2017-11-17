import passport from 'passport'
import Admin from '../models/admin'
import User from '../models/user'
import config from '../config'

//token验证模块
const Strategy = require('passport-http-bearer').Strategy

module.exports = function(passport){
  // 创建一个名为admin的验证
  passport.use('admin', new Strategy(
    function(token,done){
      Admin.findOne({token:token},function(err,admin){
        if(err) return done(err);
        if(!admin) return done(null,false);
        return done(null,admin)  
      })
    }
  ))
  // 创建一个名user的验证
  passport.use('user',new Strategy(
    function(token,done){
      User.findOne({token:token},function(err,user){
        if(err) return done(err);
        if(!user) return done(null,false);
        return done(null,user)  
      })
    }
  ))
}

