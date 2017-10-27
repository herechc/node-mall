var User = require('../models/user')
import jwt from 'jsonwebtoken';//token
import passport from 'passport'
import config from '../config'
exports.signup = function(req,res){
  if(!req.body.name || !req.body.password){
    res.json({message: '请输入您的帐号密码',code: -1})
  }else {
    var _user = new User({
      name: req.body.name,
      password: req.body.password
    })
    _user.save(function(err){
      if(err){
        console.log(err)
        return res.json({message:'注册失败,帐号已经存在',code:-1})
      }
      res.json({
        code: 0,
        message:'处理成功'
      })
    })
  }
}
exports.login = function(req,res){
  var _name = req.body.name
  var psw = req.body.password
  User.findOne({name:_name},function(err,user){
    if(err){
      console.log(err)
    }
    try{
      if(!_name||!psw){
        throw new Error('账号密码不能为空')
      }
    }catch(err){
      res.send({
        code:-1,
        type:'ERROR_PRAMAS',
        message:err.message
      })
      return
    }
    if(!user){
      return res.json({message: '不存在账号',code:-1,type:'ERROR_PARAMS'})
    }
    user.comparePassword(psw,function(err,isMatch){
      if(err){
        console.log(err)
      }
      if(isMatch && !err){
        let token =  jwt.sign({name:user.name},config.secret,{
          expiresIn:10080
        })
        user.token = token
        user.save(err=>{
          if(err) res.send(err)
        })
        res.json({
          message:'处理成功',
          code:0,
          type:'SUCCESS',
          token: token
        })
      } else{
        res.json({message:'密码错误',code:-1,type:'ERROR_PASSWORD'})
      }
    })
  })
}
