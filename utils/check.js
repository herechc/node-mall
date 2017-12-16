import Admin from '../models/admin'

class Check{
  constructor(){

  }
  async checkAdmin(req,res,next){
    const admin_id = req.session.admin_id
    if(!admin_id && !Number(admin_id)){
      res.send({
        code:0,
        message: '您还没有登录'
      })
      return
    }else{
      const admin = await Admin.findOne({id: admin_id})
      const role = admin.role
      // console.log(role)
      if(role == 8){
        res.send({
          code:0,
          message:'权限不足，请联系管理员提升权限'
        })
        return
      }
    }
    next()
  }
}

export default new Check() 