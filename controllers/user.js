var User = require('../models/user')

exports.signup = function(req,res){
  
  var _user = new User({
    name: req.body.name,
    password: req.body.password
  })
  User.findOne({name:_user.name},function(err,user){
    if(err){
      console.log(err)
    }
    if(user){
      res.json({success: false})
    } else{
      console.log(_user)
      _user.save(function(err){
        if(err){
          console.log(err)
        }
        res.json({
          status: 0,
          message:'处理成功',
          data: req.body
        })
      })
    }
  })
}
exports.signin = function(req,res){
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
        status:-1,
        type:'ERROR_PRAMAS',
        message:err.message
      })
      return
    }
    if(!user){
      return res.json({message: '不存在账号',status:-1,type:'ERROR_PARAMS'})
    }
    user.comparePassword(psw,function(err,isMatch){
      if(err){
        console.log(err)
      }
      if(isMatch){
        res.json({message:'处理成功',status:0,type:'SUCCESS'})
      } else{
        res.json({message:'密码错误',status:-1,type:'ERROR_PASSWORD'})
      }
    })
  })
}
