import User from '../models/user'
import common from '../prototype/common'
import jwt from 'jsonwebtoken';// 用来生成我们的token
import passport from 'passport';//非常流行的权限验证库
import config from '../config'
import UserInfo from '../models/userInfo'

class _User extends common{
  constructor(){
    super()
    this.signup = this.signup.bind(this)
    this.login = this.login.bind(this)
  }
  async signup(req,res,next){
    let _userId;
    if(!req.body.username || !req.body.password){
      res.send({message:'请输入帐号密码',code:0})
    }else{
      try{
        _userId = await this.getId('user_id')
      }catch(err){
        res.send({
          code:0,
          message:'获取user_id失败'
        })
        return
      }
      const user = new User({
        username:req.body.username,
        password:req.body.password,
        id:_userId
      })
      //创建用户信息
      let userInfo = new UserInfo()
      let Uid = await this.getId('userInfo_id')
      userInfo.id = Uid
      userInfo.user = user._id
      await userInfo.save()
      //保存用户
      user.userInfo = userInfo._id
      user.save(function(err){
        if(err){
          console.log(45,err)
          return res.json({message:'注册失败',code:0})
        }

        res.send({
          code:1,
          message:'处理成功'
        })
      })
    }
  }
  login(req,res){
    const _username = req.body.username
    const psw = req.body.password
    console.log(req.body.password,!psw)
    if(!_username || !psw){
        res.send({
          message:'帐号密码不能为空',
          code:0
        })
        return
    }    
    User.findOne({username:_username},function(err,user){
      if(err) console.log(err);
      
      if(!user){
        res.send({
          message: '帐号不存在',
          code:0
        })
        return
      }
      // 检查用户名与密码并生成一个accesstoken如果验证通过
      user.comparePassword(psw,function(err,isMatch){
        if(err) console.log(err)
          console.log(isMatch)
        if(isMatch && !err){
          //生成token，expiresIn保存时间
          let token = jwt.sign({name:user.username},config.secret,{
            expiresIn:10080
          })
          
          user.token = token
          user.save(function(err){
            if(err) console.log(err)
            res.send({
              message:'处理成功',
              code:1,
              type:'SUCCESS',
              token:token,
              user_id:user.id
            })  
          })
        }else{
          res.send({
            message:'密码错误',
            code:0,
            type:'ERROR_PASSWORD'
          })
        }
      })
      
    })
  }
}

export default new _User()