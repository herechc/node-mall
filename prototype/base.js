var Ids = require('../models/ids')
exports.base = {
  idList:['restaurant_id','food_id','user_id','category_id'],
  getId:function(type){
    if(!this.idList.includes(type)){
      console.log('Id类型错误')
      throw new Error('id类型错误')
      return
    }
    try{
      var _Ids = Ids.findOne()
      _Ids[type]++
      _Ids.save()
      return _Ids[type]
    }catch(err){
      console.log('获取ID数据失败')
      throw new Error(err)
    }
  }
}