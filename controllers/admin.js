var Admin = require('../models/admin')
import jwt from 'jsonwebtoken';// 用来生成我们的token
import passport from 'passport';//非常流行的权限验证库
import config from '../config'
import common from '../prototype/common'
const _common = new common()
exports.signup = async function(req,res){
  let _adminId
  if(!req.body.name || !req.body.password){
    res.json({message: '请输入您的帐号密码',code: 0})
  }else {
    try{
      _adminId = await _common.getId('admin_id')
    }catch(err){
      res.send({
        code:0,
        message: '获取admin_id失败'
      })
      return
    }
    var _admin = new Admin({
      name: req.body.name,
      password: req.body.password,
      id: _adminId,
      role: 8
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
exports.signout = function(req,res,next){
  try{
    delete req.session.admin_id
    res.send({
      code: 1,
      message: '退出成功'
    })
  }catch(err){
    console.log('退出失败', err)
    res.send({
      code: 0,
      message: '退出失败'
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
          // console.log(323,admin.id)
          req.session.admin_id = admin.id
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
exports.list = function(req, res) {
  let {page = 0, pageSize = 20} = req.query
  page > 0 && (page -= 1)
  /*如果这样写，会返回整个模型，里面有一堆我们需要的数据，
  要不就这样写var user = await Admin.find({}).sort('meta.createAt')
  var user = Admin.find({}).sort('meta.createAt')
  console.log(1515, test)
  */
  try {
    Admin.fetch(pageSize, (pageSize * page), async function(err,_admins){
      let data = []
      // 用coutn方法获取总数
      const total = await Admin.count()
      if(err) return res.send({code:0, message:'获取失败'})
      Object.keys(_admins).forEach(key => {
        data[key] = {id: _admins[key].id, role: _admins[key].role, name: _admins[key].name, createAt: Date.parse(_admins[key].meta.createAt)}
      })
      res.send({
        code: 1,
        message: '获取成功',
        list: data,
        total: total
      })
    })
  }catch(err){
    res.send({code:0, message: '获取失败'})
    console.log(err)
  }
}

exports.adminRequired = function(req, res){

}