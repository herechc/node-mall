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
      _user.save(function(err){
        if(err){
          console.log(err)
        }
        res.json({success: true})
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
    if(!user){
      return res.json({message: '不存在账号',success: false})
    }
    user.comparePassword(psw,function(err,isMatch){
      if(err){
        console.log(err)
      }
      if(isMatch){
        res.json({success:true})
      } else{
        res.json({message:'密码错误',success:false})
      }
    })
  })
}
