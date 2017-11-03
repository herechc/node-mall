var mongoose = require('mongoose')

var IdsSchema = new mongoose.Schema({
  restaurant_id:Number,
  food_id:Number,
  user_id:Number,
  category_id:Number,
  img_id:Number,
  banner_id:Number,
  goods_id:Number
})

var Ids = mongoose.model('Ids',IdsSchema)

Ids.findOne((err,data) => {
  if(!data){
    const newIds = new Ids({
      restaurant_id:0,
      food_id:0,
      user_id:0,
      category_id:0,
      img_id:0,
      banner_id:0,
      goods_id:0
    })
    newIds.save()
  }
})

module.exports = Ids