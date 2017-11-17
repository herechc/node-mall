import Order from '../models/order'
import common from '../prototype/common'
import User from '../models/user'

class _Order extends common{
  constructor(){
    super()
    this.addOrder = this.addOrder.bind(this)
  }
  async addOrder(req,res){
    let data = req.body,userId = req.params.id,order_id;
    order_id = await this.getId('order_id')
    if(!order_id){
      res.send({
        type:'ERROR_PARAMS',
        message:'获取订单id失败',
        code:0
      })
    }
    try{
      if(!(data.entities instanceof Array) || !entities.length){
        throw new Eroor('entities参数错误')
      }else if(!(data.entities[0] instanceof Array) || !entities[0].length){
        throw new Error('entities参数错误')
      }
    }catch(err){
      res.send({
        message:err.message,
        code:0
      })
    }
    
    let user = await User.findById(userId)
    let newOrder = {
      entities:data.entities,
      user_id:userId,
      id:order_id
    }
    try{
      let order = new Order(newOrder)
      user.order.push(order._id)
      order.user = user._id
      await order.save()
      await user.save()
      res.send({
        message:处理成功,
        code:1
      })
    }catch(err){
      res.send({
        code:0,
        message:'处理失败'
      })
    }


  }
}
export default new _Order()
