// var Ids = require('../models/ids')
exports.base = {
  idList:['restaurant_id','food_id','user_id','category_id'],
  getId:function(type){
    if(!this.idList.includes(type)){
      console.log('Id类型错误')
      throw new Error('id类型错误')
      return
    }
    // try{
    //   var idData;
    //   Ids.findOne(function(err,data){
    //     //可以用then
    //     //因为有延迟，所以当save时，数据还没回来，所以不能跟demo那个一样写
    //     idData = data
    //     idData[type]++;
		// 	  idData.save().then(function(){
    //       console.log(1,idData[type])
    //       return idData[type]
    //     });
    //   });
    // }catch(err){
    //   console.log('获取ID数据失败')
    //   throw new Error(err)
    // }
  }
}