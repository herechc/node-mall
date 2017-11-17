var Admin = require('../models/admin')
import jwt from 'jsonwebtoken';// 用来生成我们的token
import passport from 'passport';//非常流行的权限验证库
import config from '../config'
exports.signup = function(req,res){
  if(!req.body.name || !req.body.password){
    res.json({message: '请输入您的帐号密码',code: 0})
  }else {
    var _admin = new Admin({
      name: req.body.name,
      password: req.body.password
    })
    _admin.save(function(err){
      if(err){
        console.log(err)
        return res.json({message:'注册失败,帐号已经存在',code:0})
      }
      res.json({
        code: 1,
        message:'处理成功'
      })
    })
  }
}
exports.login = function(req,res){
  var _name = req.body.name
  var psw = req.body.password
  Admin.findOne({name:_name},function(err,admin){
    if(err){
      console.log(err)
    }
    try{
      if(!_name||!psw){
        throw new Error('账号密码不能为空')
      }
    }catch(err){
      res.send({
        code:0,
        type:'ERROR_PRAMAS',
        message:err.message
      })
      return
    }
    // console.log(22,admin)
    if(!admin){
      return res.json({message: '不存在账号',code:0,type:'ERROR_PARAMS'})
    }
    admin.comparePassword(psw,function(err,isMatch){
      if(err){
        console.log(err)
      }
      // console.log(isMatch,err)
      if(isMatch && !err){
        let token =  jwt.sign({name:admin.name},config.secret,{
          expiresIn:10080
        })
        admin.token = token
        admin.save(err=>{
          if(err) res.send(err)
          res.json({
            message:'处理成功',
            code:1,
            type:'SUCCESS',
            token:token
          })
        })
      } else{
        res.json({message:'密码错误',code:0,type:'ERROR_PASSWORD'})
      }
    })
  })
}
