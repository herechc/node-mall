import UserInfo from '../models/userInfo'
import common from '../prototype/common'
import User from '../models/user'
import _ from 'underscore'

class _UserInfo extends common{
  constructor(){
    super()
    //如果list函数里面的getId方法找不到，记得添加下面的bind
    this.list = this.list.bind(this)
  }
  async update(req,res){
    let userId = req.params.id, data = req.body,user,userInfoId;
    console.log(data)
    try{
      if(!data.name || !data.mobile || !data.full_address){
        throw new Error('请填写完整的信息')
      }
    }catch(err){
      res.send({
        code:0,
        message:err.message,
        type:'ERROR_PARAMS'
      })
      return
    }
    user = await User.findById(userId)
    let userInfoObj = {
      name:data.name,
      mobile:data.mobile,
      full_address:data.full_address,
      remark:data.remark || ''
    }
    try{
      let userInfo;
      UserInfo.findOne({_id:user.userInfo},function(err,_userinfo){
        if(err) console.log(err);
        userInfo = _.extend(_userinfo,userInfoObj)
        userInfo.save(function(err){
          if(err) console.log(err);
          res.send({
            message:'处理成功',
            code:1
          })
        })
      })
    }catch(err){
      res.send({
        code:0,
        message:'保存失败',
        type:'ERROR_PRAMAS'
      })
    }
  }
  list(req,res){
    const userId = req.params.id;
    if(!userId){
      res.send({
        type:'ERROR_PARAMS',
        code: 0,
        message: '用户id不能为空'
      })
    }
    User
      .find({id:userId})
      .populate('userInfo')// [select] 不填的话会返回全部
      .exec(function(err,user){
        // 这里返回的是userinfo的填充的user，而不是只有user
        if(user){
          res.send({
            code:1,
            message:'处理成功',
            list:user[0].userInfo
          })
        }else{
          res.send({
            code:0,
            message: '处理失败'
          })
        }
      })
  }
}

export default new _UserInfo()